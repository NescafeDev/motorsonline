import React, { useState, useEffect } from 'react';
import { useI18n } from "@/contexts/I18nContext";
import Header from "../components/mobile/Header";
import Footer from "../components/mobile/Footer";
import axios from 'axios';
import PageContainer from '@/components/PageContainer';

export default function TermsMobile() {
  const { currentLanguage } = useI18n();
  const [termsContent, setTermsContent] = useState('');
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();
  useEffect(() => {
    const loadTermsContent = async () => {
      try {
        // Pass the current language as a query parameter
        const response = await axios.get(`/api/privacy?lang=${currentLanguage}`);
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
  }, [currentLanguage]);

  if (loading) {
    return (
      <>
        <PageContainer>
        <div className="flex items-center justify-center min-h-[400px] px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
            <p className="text-gray-600">{t('common.loading')}</p>
          </div>
        </div>
        </PageContainer>
    </>
    );
  }

  return (
    <>
    <Header />
        <div className="py-8 xl:w-[75%] mx-auto">
            <div className="p-8">
          <h1 className="text-[30px] font-semibold leading-[150%] tracking-[-0.78px] text-motorsonline-dark mb-4">
            {t('footer.terms')}
          </h1>
          
          {termsContent ? (
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: termsContent }}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {t('messages.termsContentNotAdded')}
              </p>
            </div>
              )}
            </div>
          </div>
    <Footer />        
    </>
  );
}