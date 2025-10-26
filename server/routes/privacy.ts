import { Router, Request, Response } from "express";
import { pool } from "../db";
import { translationService } from "../services/translationService";

const router = Router();

// Function to create translations for all supported languages when admin saves content
async function createTranslationsForAllLanguages(privacyContent: string, termsContent: string): Promise<void> {
  const supportedLanguages = ['ee', 'en', 'fi', 'de', 'ru'];
  
  for (const lang of supportedLanguages) {
    try {
      let translatedPrivacy = privacyContent;
      let translatedTerms = termsContent;
      
      // For Estonian (ee), use original content
      if (lang !== 'ee' && translationService.isConfigured()) {
        // Translate privacy content
        if (privacyContent && privacyContent.trim()) {
          translatedPrivacy = await translateContentInParts(privacyContent, lang);
        }
        
        // Translate terms content
        if (termsContent && termsContent.trim()) {
          translatedTerms = await translateContentInParts(termsContent, lang);
        }
      }
      
      // Check if record exists for this language
      const [existingRows]: any = await pool.query(
        'SELECT id FROM privacy_terms WHERE lang = ?',
        [lang]
      );
      
      if (existingRows.length > 0) {
        // Update existing record
        await pool.query(
          'UPDATE privacy_terms SET privacy = ?, terms = ?, updated_at = CURRENT_TIMESTAMP WHERE lang = ?',
          [translatedPrivacy, translatedTerms, lang]
        );
      } else {
        // Insert new record
        await pool.query(
          'INSERT INTO privacy_terms (privacy, terms, lang) VALUES (?, ?, ?)',
          [translatedPrivacy, translatedTerms, lang]
        );
      }
      
      console.log(`Created/updated translation for language: ${lang}`);
    } catch (error) {
      console.error(`Error creating translation for language ${lang}:`, error);
      // Continue with other languages even if one fails
    }
  }
}

// Function to translate content by splitting it into parts
async function translateContentInParts(content: string, targetLanguage: string): Promise<string> {
  try {
    
    // Split content into parts based on <strong> tags
    const strongTagRegex = /<strong>.*?<\/strong>/g;
    const parts: string[] = [];
    let lastIndex = 0;
    let match;
    
    // Find all <strong> sections
    while ((match = strongTagRegex.exec(content)) !== null) {
      // Add content before the <strong> tag
      if (match.index > lastIndex) {
        const beforeContent = content.substring(lastIndex, match.index);
        if (beforeContent.trim()) {
          parts.push(beforeContent);
        }
      }
      
      // Add the <strong> section
      parts.push(match[0]);
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining content after the last <strong> tag
    if (lastIndex < content.length) {
      const remainingContent = content.substring(lastIndex);
      if (remainingContent.trim()) {
        parts.push(remainingContent);
      }
    }
    
    
    // Translate each part individually
    const translatedParts: string[] = [];
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      
      try {
        if (part.includes('<strong>')) {
          // This is a <strong> section - translate the text inside
          const textMatch = part.match(/<strong>(.*?)<\/strong>/);
          if (textMatch && textMatch[1].trim()) {
            const textToTranslate = textMatch[1];
            
            const translation = await translationService.translateText({
              text: textToTranslate,
              targetLanguage,
              sourceLanguage: 'ee'
            });
            
            const translatedPart = part.replace(textMatch[1], translation.translatedText);
            translatedParts.push(translatedPart);
          } else {
            translatedParts.push(part);
          }
        } else {
          // This is regular content - translate normally
          if (part.trim()) {
            const translation = await translationService.translateText({
              text: part,
              targetLanguage,
              sourceLanguage: 'ee'
            });
            translatedParts.push(translation.translatedText);
          } else {
            translatedParts.push(part);
          }
        }
      } catch (partError) {
        console.error(`Error translating part ${i + 1}:`, partError);
        translatedParts.push(part); // Use original if translation fails
      }
    }
    
    const result = translatedParts.join('');
    return result;
    
  } catch (error) {
    console.error('Error in translateContentInParts:', error);
    return content; // Return original content if translation fails
  }
}

// Test endpoint to check DeepL configuration
router.get('/test-translation', async (req: Request, res: Response) => {
  try {
    const isConfigured = translationService.isConfigured();
    const testText = "Tere, see on test.";
    
    if (!isConfigured) {
      return res.json({ 
        configured: false, 
        message: 'DeepL API key not configured. Please set DEEPL_API_KEY environment variable.' 
      });
    }
    
    const translation = await translationService.translateText({
      text: testText,
      targetLanguage: 'en',
      sourceLanguage: 'ee'
    });
    
    res.json({
      configured: true,
      original: testText,
      translated: translation.translatedText,
      detectedLanguage: translation.detectedLanguage
    });
  } catch (error: any) {
    res.status(500).json({
      configured: true,
      error: error.message,
      message: 'Translation test failed'
    });
  }
});

// Test endpoint for part-based translation
router.get('/test-parts-translation', async (req: Request, res: Response) => {
  try {
    const isConfigured = translationService.isConfigured();
    const testContent = "<p>See on tavaline tekst. <strong>Autoriõigused ja sisu kasutamine</strong> on oluline osa. <strong>Konto kasutamine ja sulgemine</strong> on teine osa. <strong>Teavitused</strong> on kolmas osa.</p>";
    
    if (!isConfigured) {
      return res.json({ 
        configured: false, 
        message: 'DeepL API key not configured. Please set DEEPL_API_KEY environment variable.' 
      });
    }
    
    const translation = await translateContentInParts(testContent, 'en');
    
    res.json({
      configured: true,
      original: testContent,
      translated: translation,
      message: 'Part-based translation test completed'
    });
  } catch (error: any) {
    res.status(500).json({
      configured: true,
      error: error.message,
      message: 'Part-based translation test failed'
    });
  }
});

// Test endpoint for full translation workflow
router.get('/test-translation-workflow', async (req: Request, res: Response) => {
  try {
    const isConfigured = translationService.isConfigured();
    
    if (!isConfigured) {
      return res.json({ 
        configured: false, 
        message: 'DeepL API key not configured. Please set DEEPL_API_KEY environment variable.' 
      });
    }
    
    const testPrivacyContent = "<p>See on privaatsuspoliitika test. <strong>Andmete kogumine</strong> on oluline osa. <strong>Andmete kasutamine</strong> on teine osa.</p>";
    const testTermsContent = "<p>See on kasutustingimuste test. <strong>Vastutuse piirangud</strong> on oluline osa. <strong>Konto kasutamine</strong> on teine osa.</p>";
    
    // Test creating translations for all languages
    await createTranslationsForAllLanguages(testPrivacyContent, testTermsContent);
    
    // Fetch all translations to verify
    const [rows]: any = await pool.query(
      'SELECT lang, privacy, terms FROM privacy_terms ORDER BY lang'
    );
    
    res.json({
      configured: true,
      message: 'Translation workflow test completed',
      translations: rows
    });
  } catch (error: any) {
    res.status(500).json({
      configured: true,
      error: error.message,
      message: 'Translation workflow test failed'
    });
  }
});

// Get privacy and terms content
router.get('/', async (req: Request, res: Response) => {
  try {
    const { lang } = req.query;
    const targetLanguage = (lang as string) || 'ee'; // Default to Estonian
    
    console.log('Privacy API called with language:', targetLanguage);
    
    // Get content for the specific language
    const [rows]: any = await pool.query(
      'SELECT privacy, terms FROM privacy_terms WHERE lang = ?',
      [targetLanguage]
    );
    
    if (rows.length === 0) {
      // If no record exists for this language, try to get Estonian as fallback
      const [fallbackRows]: any = await pool.query(
        'SELECT privacy, terms FROM privacy_terms WHERE lang = ?',
        ['ee']
      );
      
      if (fallbackRows.length === 0) {
        // If no record exists at all, return empty content
        return res.json({ privacy: '', terms: '' });
      }
      
      // Use Estonian content as fallback
      const privacyContent = fallbackRows[0].privacy || '';
      const termsContent = fallbackRows[0].terms || '';
      
      res.json({
        privacy: privacyContent,
        terms: termsContent
      });
      return;
    }
    
    // Return content for the requested language
    const privacyContent = rows[0].privacy || '';
    const termsContent = rows[0].terms || '';
    
    res.json({
      privacy: privacyContent,
      terms: termsContent
    });
  } catch (error: any) {
    console.error('Error fetching privacy/terms:', error);
    res.status(500).json({ message: 'Failed to fetch privacy/terms content', error: error.message });
  }
});

// Update privacy content
router.post('/', async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    
    if (typeof content !== 'string') {
      return res.status(400).json({ message: 'Content must be a string' });
    }
    
    // Get current terms content for translation
    const [termsRows]: any = await pool.query(
      'SELECT terms FROM privacy_terms WHERE lang = ?',
      ['ee']
    );
    const termsContent = termsRows.length > 0 ? termsRows[0].terms : '';
    
    // Create translations for all languages
    try {
      await createTranslationsForAllLanguages(content, termsContent);
      console.log('Translations created successfully for privacy content');
    } catch (translationError) {
      console.error('Error creating translations:', translationError);
      // Don't fail the request if translation fails
    }
    
    res.json({ message: 'Privacy content updated successfully' });
  } catch (error: any) {
    console.error('Error updating privacy content:', error);
    res.status(500).json({ message: 'Failed to update privacy content', error: error.message });
  }
});

// Update terms content
router.post('/terms', async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    
    if (typeof content !== 'string') {
      return res.status(400).json({ message: 'Content must be a string' });
    }
    
    // Get current privacy content for translation
    const [privacyRows]: any = await pool.query(
      'SELECT privacy FROM privacy_terms WHERE lang = ?',
      ['ee']
    );
    const privacyContent = privacyRows.length > 0 ? privacyRows[0].privacy : '';
    
    // Create translations for all languages
    try {
      await createTranslationsForAllLanguages(privacyContent, content);
      console.log('Translations created successfully for terms content');
    } catch (translationError) {
      console.error('Error creating translations:', translationError);
      // Don't fail the request if translation fails
    }
    
    res.json({ message: 'Terms content updated successfully' });
  } catch (error: any) {
    console.error('Error updating terms content:', error);
    res.status(500).json({ message: 'Failed to update terms content', error: error.message });
  }
});

export default router;
