import React, { useState, useEffect } from 'react';
import { useI18n } from "@/contexts/I18nContext";
import Header from "../components/mobile/Header";
import Footer from "../components/mobile/Footer";
import axios from 'axios';

export default function PrivacyMobile() {
  const { currentLanguage } = useI18n();
  const [privacyContent, setPrivacyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  useEffect(() => {
    const loadPrivacyContent = async () => {
      try {
        // Pass the current language as a query parameter
        const response = await axios.get(`/api/privacy?lang=${currentLanguage}`);
        if (response.data.privacy) {
          setPrivacyContent(response.data.privacy);
        }
      } catch (error) {
        console.error("Error loading privacy content:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPrivacyContent();
  }, [currentLanguage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px] px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
            <p className="text-gray-600">{t('common.loading')}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="px-4 py-6">
        <div className="p-6">
          <h1 className="text-[30px] font-semibold leading-[150%] tracking-[-0.78px] text-motorsonline-dark mb-4">
            {t('footer.privacy')}
          </h1>
          
          {privacyContent ? (
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: privacyContent }}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {t('messages.privacyContentNotAdded')}
              </p>
            </div>
          )}
        </div>
      </div>
    <Footer />
    </>
  );
}
