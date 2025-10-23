import axios from 'axios';

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
    
    return languageMap[language] || 'EN';
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
      const sourceLang = request.sourceLanguage ? this.getDeepLLanguageCode(request.sourceLanguage) : undefined;

      const response = await axios.post(
        this.baseUrl,
        new URLSearchParams({
          text: request.text,
          target_lang: targetLang,
          source_lang: sourceLang,
          preserve_formatting: 'true',
          tag_handling: 'html',
          split_sentences: '0', // Disable sentence splitting
          non_splitting_tags: 'span,p', // Prevent splitting within <span> and <p>
          splitting_tags: '' // Avoid splitting on any tags
        }),
        {
          headers: {
            'Authorization': `DeepL-Auth-Key ${this.apiKey}`,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          }
        }
      );
      
      const result = response.data.translations[0].text;
      
      if (result.length > 0) {
        return {
          translatedText: result,
          detectedLanguage: 'ET',
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
