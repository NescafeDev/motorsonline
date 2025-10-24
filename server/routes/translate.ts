import express from 'express';
import { TranslationService } from '../services/translationService';

const router = express.Router();
const translationService = new TranslationService();

// POST /api/translate
router.post('/', async (req, res) => {
  try {
    const { text, targetLanguage, sourceLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ 
        error: 'Text and targetLanguage are required' 
      });
    }

    // If target language is Estonian, return original text
    if (targetLanguage === 'ee') {
      return res.json({ 
        translatedText: text,
        originalText: text,
        targetLanguage: targetLanguage 
      });
    }

    // Check if translation service is configured
    if (!translationService.isConfigured()) {
      console.warn('DeepL API not configured, returning original text');
      return res.json({ 
        translatedText: text,
        originalText: text,
        targetLanguage: targetLanguage,
        warning: 'Translation service not configured'
      });
    }

    // Translate the text
    const result = await translationService.translateText({
      text,
      targetLanguage,
      sourceLanguage: sourceLanguage || 'ee'
    });

    res.json({
      translatedText: result.translatedText,
      originalText: text,
      targetLanguage: targetLanguage,
      detectedLanguage: result.detectedLanguage
    });

  } catch (error: any) {
    console.error('Translation error:', error);
    
    // Return original text if translation fails
    res.json({
      translatedText: req.body.text,
      originalText: req.body.text,
      targetLanguage: req.body.targetLanguage,
      error: 'Translation failed, using original text'
    });
  }
});

export default router;
