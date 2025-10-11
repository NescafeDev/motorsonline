import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const useCurrentLanguage = () => {
  const { lang } = useParams<{ lang: string }>();
  const location = useLocation();
  const [currentLang, setCurrentLang] = useState<string>('ee');

  useEffect(() => {
    // First, try to get language from URL params
    if (lang && ['en', 'ee', 'ru'].includes(lang.toLowerCase())) {
      setCurrentLang(lang.toLowerCase());
      return;
    }

    // If no valid lang in params, try to extract from pathname
    const pathSegments = location.pathname.split('/');
    const urlLang = pathSegments[1]?.toLowerCase();
    if (urlLang && ['en', 'ee', 'ru'].includes(urlLang)) {
      setCurrentLang(urlLang);
      return;
    }

    // Fallback to localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage && ['EN', 'EE', 'RU'].includes(savedLanguage)) {
      setCurrentLang(savedLanguage.toLowerCase());
      return;
    }

    // Final fallback to Estonian
    setCurrentLang('ee');
  }, [lang, location.pathname]);
  return currentLang;
};
