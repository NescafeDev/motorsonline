import React, { useState, useEffect } from 'react';
import { useI18n } from "@/contexts/I18nContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageContainer from "../components/PageContainer";
import axios from 'axios';

export default function Privacy() {
  const { currentLanguage } = useI18n();
  const [privacyContent, setPrivacyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();
  useEffect(() => {
    const loadPrivacyContent = async () => {
      try {
        const response = await axios.get("/api/privacy");
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
  }, []);

  if (loading) {
    return (
        <PageContainer>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
              <p className="text-gray-600">{t('common.loading')}</p>
            </div>
          </div>
        </PageContainer>
    );
  }

  return (
      <PageContainer>
        <div className="py-8 px-16 max-w-[1440px] mx-auto">
            <div className="bg-white p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                {t('footer.privacy')}
              </h1>
              
              {privacyContent ? (
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: privacyContent }}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {t('messages.privacyContentNotAdded')}
                  </p>
                </div>
              )}
          </div>
        </div>
      </PageContainer>
  );
}
