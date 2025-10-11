import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useParams, useLocation } from 'react-router-dom';

export type SupportedLanguage = 'en' | 'ee' | 'ru';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ee', name: 'Estonian', nativeName: 'Eesti', flag: '🇪🇪' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
];

export const DEFAULT_LANGUAGE: SupportedLanguage = 'ee';

interface I18nContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  languages: LanguageConfig[];
  isLoading: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const { lang } = useParams<{ lang: string }>();
  const location = useLocation();

  // Get current language from URL or localStorage
  const getCurrentLanguage = (): SupportedLanguage => {
    console.log('getCurrentLanguage - lang param:', lang);
    console.log('getCurrentLanguage - location.pathname:', location.pathname);
    
    // First, try to get language from URL params
    if (lang && SUPPORTED_LANGUAGES.some(l => l.code === lang.toLowerCase())) {
      console.log('getCurrentLanguage - Using lang param:', lang);
      return lang.toLowerCase() as SupportedLanguage;
    }

    // If no valid lang in params, try to extract from pathname
    const pathSegments = location.pathname.split('/');
    const urlLang = pathSegments[1]?.toLowerCase();
    console.log('getCurrentLanguage - pathSegments:', pathSegments);
    console.log('getCurrentLanguage - urlLang from pathname:', urlLang);
    
    if (urlLang && SUPPORTED_LANGUAGES.some(l => l.code === urlLang)) {
      console.log('getCurrentLanguage - Using urlLang from pathname:', urlLang);
      return urlLang as SupportedLanguage;
    }

    // Fallback to localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage');
    console.log('getCurrentLanguage - savedLanguage from localStorage:', savedLanguage);
    
    if (savedLanguage && SUPPORTED_LANGUAGES.some(l => l.code === savedLanguage.toLowerCase())) {
      console.log('getCurrentLanguage - Using savedLanguage:', savedLanguage);
      return savedLanguage.toLowerCase() as SupportedLanguage;
    }

    // Final fallback to default
    console.log('getCurrentLanguage - Using DEFAULT_LANGUAGE:', DEFAULT_LANGUAGE);
    return DEFAULT_LANGUAGE;
  };

  // Initialize state with language from URL
  const [currentLanguage, setCurrentLanguageState] = useState<SupportedLanguage>(() => {
    // Initialize with the current language from URL on first render
    const initialLang = getCurrentLanguage();
    console.log('Initial language on mount:', initialLang);
    return initialLang;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [translations, setTranslations] = useState<Record<string, any>>({});

  // Load translations for the current language
  const loadTranslations = async (language: SupportedLanguage) => {
    console.log(`Loading translations for language: ${language}`);
    setIsLoading(true);
    try {
      const translationModule = await import(`../locales/${language}.json`);
      setTranslations(translationModule.default);
      console.log(`Successfully loaded translations for ${language}`);
    } catch (error) {
      console.error(`Failed to load translations for ${language}:`, error);
      // Fallback to default language if current language fails
      if (language !== DEFAULT_LANGUAGE) {
        try {
          const fallbackModule = await import(`../locales/${DEFAULT_LANGUAGE}.json`);
          setTranslations(fallbackModule.default);
          console.log(`Loaded fallback translations for ${DEFAULT_LANGUAGE}`);
        } catch (fallbackError) {
          console.error(`Failed to load fallback translations:`, fallbackError);
          // Set empty translations as final fallback
          setTranslations({});
        }
      } else {
        // Set empty translations as final fallback
        setTranslations({});
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize and update language when URL or location changes
  useEffect(() => {
    console.log('I18nContext useEffect triggered');
    console.log('lang param:', lang);
    console.log('location.pathname:', location.pathname);
    console.log('currentLanguage:', currentLanguage);
    
    const newLanguage = getCurrentLanguage();
    console.log('newLanguage detected:', newLanguage);
    
    if (newLanguage !== currentLanguage) {
      console.log('Updating language from', currentLanguage, 'to', newLanguage);
      setCurrentLanguageState(newLanguage);
      localStorage.setItem('selectedLanguage', newLanguage.toUpperCase());
    }
  }, [lang, location.pathname]);

  // Load translations when language changes
  useEffect(() => {
    loadTranslations(currentLanguage);
  }, [currentLanguage]);

  // Translation function
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations;

    // Navigate through nested object keys
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Return the key if translation not found
        console.warn(`Translation missing for key: ${key}`);
        return key;
      }
    }

    // Handle string interpolation
    if (typeof value === 'string' && params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return typeof value === 'string' ? value : key;
  };

  // Set language function
  const setLanguage = (language: SupportedLanguage) => {
    if (language !== currentLanguage) {
      setCurrentLanguageState(language);
      localStorage.setItem('selectedLanguage', language.toUpperCase());
      loadTranslations(language);
    }
  };

  const value: I18nContextType = {
    currentLanguage,
    setLanguage,
    t,
    languages: SUPPORTED_LANGUAGES,
    isLoading,
  };

  return (
    <I18nContext.Provider value={value}>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading...</div>
        </div>
      ) : (
        children
      )}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

// Convenience hook for translations
export const useTranslation = () => {
  const { t, currentLanguage, isLoading } = useI18n();
  return { t, currentLanguage, isLoading };
};
