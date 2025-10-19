import React, { useState, useEffect } from 'react';
import { useI18n } from "@/contexts/I18nContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageContainer from "../components/PageContainer";
import axios from 'axios';

export default function Terms() {
  const { currentLanguage } = useI18n();
  const [termsContent, setTermsContent] = useState('');
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();
  
  useEffect(() => {
    const loadTermsContent = async () => {
      try {
        const response = await axios.get("/api/privacy");
        if (response.data.terms) {
          setTermsContent(response.data.terms);
        }
      } catch (error) {
        console.error("Error loading terms content:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTermsContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageContainer>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
              <p className="text-gray-600">{t('common.loading')}</p>
            </div>
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
      <PageContainer>
        <div className="py-8 xl:w-[75%] mx-auto">
            <div className="bg-white p-8">
              <h1 className="text-[30px] font-semibold leading-[150%] tracking-[-0.78px] text-motorsonline-dark mb-6">
                {t('footer.terms')}
              </h1>
              
              {termsContent ? (
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: termsContent }}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {t('messages.termsContentNotAdded')}
                  </p>
                </div>
              )}
            </div>
          </div>
      </PageContainer>
  );
}
