import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { Separator } from "../../../../components/ui/separator";
import { useI18n } from "@/contexts/I18nContext";
import { translateEquipmentText } from "@/lib/utils";
import { Button } from "../../../../components/ui/button";
import { ChevronDownIcon } from "lucide-react";

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
  const [isEquipmentExpanded, setIsEquipmentExpanded] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const TRUNCATE_LENGTH = 300;

  // Reset expanded states when car or language changes
  useEffect(() => {
    setIsEquipmentExpanded(false);
    setIsDescriptionExpanded(false);
  }, [car?.id, currentLanguage]);

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
          console.log(translatedEquipment)
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

  // Helper function to truncate text
  const truncateText = (text: string, length: number): string => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

  // Get equipment content
  const getEquipmentContent = () => {
    if (!car?.equipment || !car.equipment.trim()) return null;
    const equipmentText = translatedEquipment || car.equipment;
    const shouldTruncate = equipmentText.length > TRUNCATE_LENGTH && !isEquipmentExpanded;
    const displayText = shouldTruncate ? truncateText(equipmentText, TRUNCATE_LENGTH) : equipmentText;
    return displayText;
  };

  // Get description content
  const getDescriptionContent = () => {
    if (!car?.description || !car.description.trim()) return null;
    const descriptionText = translatedDescription || car.description;
    const shouldTruncate = descriptionText.length > TRUNCATE_LENGTH && !isDescriptionExpanded;
    const displayText = shouldTruncate ? truncateText(descriptionText, TRUNCATE_LENGTH) : descriptionText;
    return displayText;
  };

  return (
    <section className="w-full max-w-[1240px] mx-auto mt-8">
      <Card className="bg-[#f6f7f9] rounded-[10px] p-5">
        <CardContent className="p-0 space-y-8">
          {/* Equipment */}
          <div className="space-y-4">
            <h2 className="font-['Poppins',Helvetica] font-semibold text-secondary-500 text-lg tracking-[-0.60px] leading-[30px]">
              {t('formLabels.equipment')}
            </h2>
            <div className="space-y-2">
              <ul className="font-['Poppins',Helvetica] font-normal text-secondary-500 text-lg tracking-[-0.54px] leading-[27px] pl-6 space-y-2">
                {isTranslating ? (
                  <li className="text-gray-500 italic">{t('common.translating')}</li>
                ) : car?.equipment && car.equipment.trim() ? (
                  (() => {
                    const displayText = getEquipmentContent();

                    return displayText ? displayText.split(/\r?\n|\r|\n/g).map((item, index) => {
                      const trimmedItem = item.trim();
                      if (!trimmedItem) return null;
                      return (
                        <li key={index} className="break-words leading-relaxed">
                          {trimmedItem.includes('•') ? (
                            trimmedItem
                          ) : (
                            <p className="font-semibold mt-5">{trimmedItem}</p>
                          )}
                        </li>
                      );
                    }) : null;
                  })()
                ) : (
                  <li>{t('formLabels.equipmentDataMissing')}</li>
                )}
              </ul>
              {car?.equipment && car.equipment.trim() && (translatedEquipment || car.equipment).length > TRUNCATE_LENGTH && (
                <div className="flex justify-center mt-5">
                <Button
                  variant="outline"
                  onClick={() => setIsEquipmentExpanded(!isEquipmentExpanded)}
                  className="border-[#06d6a0] text-[#06d6a0] rounded-[10px] flex items-center gap-2.5"
                >
                  {isEquipmentExpanded ? t('formLabels.showLess') : t('formLabels.showMore')}
                  <ChevronDownIcon className={`w-4 h-4 transition-transform ${isEquipmentExpanded ? 'rotate-180' : ''}`} />
                </Button>
                </div>
              )}
            </div>
          </div>
          {/* Vehicle description */}
          <div className="space-y-4">
            <h2 className="font-['Poppins',Helvetica] font-semibold text-secondary-500 text-lg tracking-[-0.60px] leading-[30px]">
              {t('formLabels.vehicleDescription')}
            </h2>
            <div className="space-y-2">
              <div className="font-['Poppins',Helvetica] font-normal text-secondary-500 text-lg tracking-[-0.54px] leading-[27px]">
                {isTranslating ? (
                  <p className="text-gray-500 italic">{t('common.translating')}</p>
                ) : car?.description && car.description.trim() ? (
                  <p className="break-words leading-relaxed py-1">{getDescriptionContent()}</p>
                ) : (
                  <p>{t('formLabels.descriptionMissing')}</p>
                )}
              </div>
              {car?.description && car.description.trim() && (translatedDescription || car.description).length > TRUNCATE_LENGTH && (
                <div className="flex justify-center mt-5">
                <Button
                  variant="outline"
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="border-[#06d6a0] text-[#06d6a0] rounded-[10px] flex items-center gap-2.5"
                >
                  {isDescriptionExpanded ? t('formLabels.showLess') : t('formLabels.showMore')}
                  <ChevronDownIcon className={`w-4 h-4 transition-transform ${isDescriptionExpanded ? 'rotate-180' : ''}`} />
                </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
