import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface LanguageWrapperProps {
  children: React.ReactNode;
}

export const LanguageWrapper: React.FC<LanguageWrapperProps> = ({ children }) => {
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // Validate language parameter
    const validLanguages = ['en', 'ee', 'ru', 'de', 'fi'];
    const currentLang = lang?.toLowerCase();
    
    if (!currentLang || !validLanguages.includes(currentLang)) {
      // If no language in URL or invalid language, redirect to default (Estonian)
      navigate('/ee', { replace: true });
    }
  }, [lang, navigate]);

  return <>{children}</>;
};
