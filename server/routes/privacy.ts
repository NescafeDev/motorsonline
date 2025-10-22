import { Router, Request, Response } from "express";
import { pool } from "../db";
import { translationService } from "../services/translationService";

const router = Router();

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

// Get privacy and terms content
router.get('/', async (req: Request, res: Response) => {
  try {
    const { lang } = req.query;
    const targetLanguage = (lang as string) || 'ee'; // Default to Estonian
    
    console.log('Privacy API called with language:', targetLanguage);
    console.log('DeepL service configured:', translationService.isConfigured());
    
    const [rows]: any = await pool.query(
      'SELECT privacy, terms FROM privacy_terms ORDER BY id DESC LIMIT 1'
    );
    
    if (rows.length === 0) {
      // If no record exists, return empty content
      return res.json({ privacy: '', terms: '' });
    }
    
    let privacyContent = rows[0].privacy || '';
    let termsContent = rows[0].terms || '';
    
    console.log('Original privacy content length:', privacyContent.length);
    
    // If language is not Estonian (default), translate the content
    if (targetLanguage !== 'ee' && translationService.isConfigured()) {
      console.log('Attempting translation to:', targetLanguage);
      try {
        if (privacyContent) {
          console.log('Translating privacy content...');
          const privacyTranslation = await translationService.translateText({
            text: privacyContent,
            targetLanguage,
            sourceLanguage: 'ee'
          });
          privacyContent = privacyTranslation.translatedText;
          console.log('Privacy translation completed, length:', privacyContent.length);
        }
        
        if (termsContent) {
          console.log('Translating terms content...');
          const termsTranslation = await translationService.translateText({
            text: termsContent,
            targetLanguage,
            sourceLanguage: 'ee'
          });
          termsContent = termsTranslation.translatedText;
          console.log('Terms translation completed, length:', termsContent.length);
        }
      } catch (translationError) {
        console.error('Translation error:', translationError);
        // Return original content if translation fails
      }
    } else if (targetLanguage !== 'ee') {
      console.log('DeepL service not configured, returning original content');
    }
    
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
    
    // Check if a record exists
    const [existingRows]: any = await pool.query(
      'SELECT id FROM privacy_terms ORDER BY id DESC LIMIT 1'
    );
    
    if (existingRows.length > 0) {
      // Update existing record
      await pool.query(
        'UPDATE privacy_terms SET privacy = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [content, existingRows[0].id]
      );
    } else {
      // Insert new record
      await pool.query(
        'INSERT INTO privacy_terms (privacy, terms) VALUES (?, ?)',
        [content, '']
      );
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
    
    // Check if a record exists
    const [existingRows]: any = await pool.query(
      'SELECT id FROM privacy_terms ORDER BY id DESC LIMIT 1'
    );
    
    if (existingRows.length > 0) {
      // Update existing record
      await pool.query(
        'UPDATE privacy_terms SET terms = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [content, existingRows[0].id]
      );
    } else {
      // Insert new record
      await pool.query(
        'INSERT INTO privacy_terms (privacy, terms) VALUES (?, ?)',
        ['', content]
      );
    }
    
    res.json({ message: 'Terms content updated successfully' });
  } catch (error: any) {
    console.error('Error updating terms content:', error);
    res.status(500).json({ message: 'Failed to update terms content', error: error.message });
  }
});

export default router;
