import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useI18n, SupportedLanguage } from '@/contexts/I18nContext';

interface LanguageDropdownProps {
  className?: string;
  onLanguageChange?: (language: SupportedLanguage) => void;
}

export const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ 
  className = '', 
  onLanguageChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLanguage, languages, setLanguage, t } = useI18n();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageSelect = (language: SupportedLanguage) => {
    setIsOpen(false);
    
    // Get current path without language prefix
    const pathSegments = location.pathname.split('/');
    const currentPath = pathSegments.slice(2).join('/');
    
    // Construct new path with proper formatting
    let newPath = `/${language}`;
    if (currentPath) {
      newPath += `/${currentPath}`;
    }
    
    // Update language in context first
    setLanguage(language);
    
    // Navigate to new language URL
    navigate(newPath);
    
    // Call the callback if provided
    if (onLanguageChange) {
      onLanguageChange(language);
    }
  };

  const currentLanguageConfig = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-3 rounded-lg border border-brand-primary hover:bg-brand-primary hover:text-white transition-colors bg-white shadow-sm"
      >
        <span className="text-sm font-medium text-gray-700">{currentLanguageConfig?.code.toUpperCase()}</span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px]">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                currentLanguage === language.code ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
              }`}
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium">{language.nativeName}</span>
                <span className="text-xs text-gray-500">{language.name}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
