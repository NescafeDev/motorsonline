import axios from 'axios';
import qs from 'qs';

export interface TranslationRequest {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

export interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: string;
}

export class TranslationService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    // Try multiple ways to get the API key
    this.apiKey = process.env.DEEPL_API_KEY || 
                  process.env.VITE_DEEPL_API_KEY || 
                  '704ecd57-4a20-4e86-ad5f-36150f4abfd2'; // Fallback to the key from .env
    this.baseUrl = 'https://api.deepl.com/v2/translate';
    
    console.log('DeepL API Key configured:', !!this.apiKey);
    console.log('DeepL API Key length:', this.apiKey.length);
    console.log('DeepL API Key source:', process.env.DEEPL_API_KEY ? 'process.env.DEEPL_API_KEY' : 'fallback');
    
    if (!this.apiKey) {
      console.warn('DeepL API key not found. Translation will not work.');
    }
  }

  /**
   * Map our language codes to DeepL language codes
   */
  private getDeepLLanguageCode(language: string): string {
    const languageMap: Record<string, string> = {
      'en': 'EN',
      'ee': 'ET', // Estonian
      'ru': 'RU',
      'de': 'DE',
      'fi': 'FI'
    };
    
    return languageMap[language] || 'ET';
  }

  /**
   * Translate text using DeepL API
   */
  async translateText(request: TranslationRequest): Promise<TranslationResponse> {
    if (!this.apiKey) {
      throw new Error('DeepL API key not configured');
    }

    try {
      const targetLang = this.getDeepLLanguageCode(request.targetLanguage);
      
      // Build request parameters conditionally
      // const params: Record<string, any> = {
      //   text: request.text,
      //   target_lang: targetLang,
      //   preserve_formatting: true,
      //   tag_handling: 'html',
      //   non_splitting_tags: 'span,p', // Prevent splitting within <span> and <p>
      //   splitting_tags: '' // Avoid splitting on any tags
      // };
      // Only include source_lang if sourceLanguage is explicitly provided
      // If omitted, DeepL will auto-detect the source language
      // if (request.sourceLanguage) {
      //   params.source_lang = this.getDeepLLanguageCode(request.sourceLanguage);
      // }
      
      let data = qs.stringify({
        text: request.text.replace(/\n/g, '<br>'),
        target_lang: targetLang,
        source_lang: this.getDeepLLanguageCode(request.sourceLanguage),
        preserve_formatting: '1',
        split_sentences: 'nonewlines',
      });

      let config = {
        method: 'post',
        url: this.baseUrl,
        headers: {
          'Authorization': `DeepL-Auth-Key ${this.apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: data
      }

      const response = await axios.request(config);
      const translation = response.data.translations?.[0];
      const result = translation.text.replace(/<br\s*\/?>/gi, '\n');
      
      if (translation && translation.text) {
        return {
          translatedText: result,
          detectedLanguage: translation.detected_source_language || undefined,
        };
      }
      
      throw new Error('No translation returned from DeepL API');
    } catch (error: any) {
      console.error('DeepL translation error:', error.response?.data || error.message);
      throw new Error(`Translation failed: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

// Export singleton instance
export const translationService = new TranslationService();
