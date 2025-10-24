import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { Separator } from "../../../../components/ui/separator";
import { useI18n } from "@/contexts/I18nContext";
import { translateEquipmentText } from "@/lib/utils";

interface CarData {
  id: number;
  brand_name?: string;
  model_name?: string;
  year_value?: number;
  mileage: number;
  power: string;
  transmission: string;
  fuelType: string;
  ownerCount: string;
  displacement: string;
  technicalData: string;
  category: string;
  plateNumber: string;
  price: number;
  discountPrice?: number;
  vatRate?: string;
  vatRefundable?: string;
  images?: string[];
  equipment?: string;
  description?: string;
  created_at?: string;
  // Seller information
  businessType?: string;
  country?: string;
  phone?: string;
  email?: string;
}

interface ImageGallerySectionProps {
  car?: CarData | null;
}

export const ImageGallerySection = ({ car }: ImageGallerySectionProps): JSX.Element => {
  // Vehicle description data
  const { t, currentLanguage } = useI18n();
  const [translatedEquipment, setTranslatedEquipment] = useState<string | null>(null);
  const [translatedDescription, setTranslatedDescription] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  // Translate equipment and description when car data or language changes
  useEffect(() => {
    const translateContent = async () => {
      if (!car || currentLanguage === 'ee') {
        setTranslatedEquipment(null);
        setTranslatedDescription(null);
        return;
      }

      setIsTranslating(true);
      
      try {
        // Translate equipment
        if (car.equipment && car.equipment.trim()) {
          const translatedEquip = await translateEquipmentText(car.equipment, currentLanguage);
          setTranslatedEquipment(translatedEquip);
        }

        // Translate description
        if (car.description && car.description.trim()) {
          const translatedDesc = await translateEquipmentText(car.description, currentLanguage);
          setTranslatedDescription(translatedDesc);
        }
      } catch (error) {
        console.error('Translation error:', error);
        // Keep original text if translation fails
        setTranslatedEquipment(null);
        setTranslatedDescription(null);
      } finally {
        setIsTranslating(false);
      }
    };

    translateContent();
  }, [car, currentLanguage]);
  
  return (
    <section className="w-full max-w-[1240px] mx-auto mt-8">
      <Card className="bg-[#f6f7f9] rounded-[10px] p-5">
        <CardContent className="p-0 space-y-8">
          {/* Equipment */}
          <div className="space-y-4">
            <h2 className="font-['Poppins',Helvetica] font-semibold text-secondary-500 text-lg tracking-[-0.60px] leading-[30px]">
              {t('formLabels.equipment')}
            </h2>
            <ul className="font-['Poppins',Helvetica] font-normal text-secondary-500 text-lg tracking-[-0.54px] leading-[27px] pl-6 space-y-2">
              {isTranslating ? (
                <li className="text-gray-500 italic">{t('common.translating')}</li>
              ) : car?.equipment && car.equipment.trim() ? (
                (translatedEquipment || car.equipment).split(/\r?\n|\r|\n/g).map((item, index) => (
                  <li key={index} className="break-words leading-relaxed">{
                      item.trim().includes('•') ? (
                        item.trim()
                      ) : (
                        <p className="font-semibold mt-5">{item.trim()}</p>
                      )
                    }</li>
                ))
              ) : (
                <li>{t('formLabels.equipmentDataMissing')}</li>
              )}
            </ul>
          </div>
          {/* Vehicle description */}
          <div className="space-y-4">
            <h2 className="font-['Poppins',Helvetica] font-semibold text-secondary-500 text-lg tracking-[-0.60px] leading-[30px]">
              {t('formLabels.vehicleDescription')}
            </h2>
            <div className="font-['Poppins',Helvetica] font-normal text-secondary-500 text-lg tracking-[-0.54px] leading-[27px]">
              {isTranslating ? (
                <p className="text-gray-500 italic">{t('common.translating')}</p>
              ) : car?.description && car.description.trim() ? (
                <p className="break-words leading-relaxed py-1">{translatedDescription || car.description}</p>
              ) : (
                <p>{t('formLabels.descriptionMissing')}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
