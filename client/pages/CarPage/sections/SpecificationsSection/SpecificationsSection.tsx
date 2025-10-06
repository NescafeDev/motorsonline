import React, { useMemo } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { Card, CardContent } from "../../../../components/ui/card";
import { CountryCode, CountryFlag } from 'react-country-flags-lazyload';
import ReactCountryFlag from 'react-country-flag';
import countryList from "react-select-country-list";

export interface SellerData {
  title: string;
  company?: string;
  address?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  avatar?: string;
  language?: string;
  website?: string;
  country?: string;
}

interface SpecificationsSectionProps {
  sellerData?: SellerData;
}

export const SpecificationsSection = ({ sellerData }: SpecificationsSectionProps): JSX.Element => {
  // Default fallback data if no seller data is provided
  const defaultSellerData: SellerData = {
    title: "Müüja andmed",
    company: "ELKE Mustamäe",
    address: "Tallinn, Mustamäe tee 22",
    contactPerson: "Lorem Ipsum",
    phone: "+372 8888 8888",
    email: "Näide@elke.ee",
    language: "en",
    website: "example.com",
    country: "EE"
  };
  const options = useMemo(() => countryList().getData(), []);

  // Use provided seller data or fallback to default
  const displayData = sellerData || defaultSellerData;

  // Function to map language codes to country codes for flags
  const getCountryCodeFromLanguage = (languageCode: string): string => {
    const languageToCountryMap: { [key: string]: string } = {
      'en': 'GB', // English -> United Kingdom
      'et': 'EE', // Estonian -> Estonia
      'fi': 'FI', // Finnish -> Finland
      'sv': 'SE', // Swedish -> Sweden
      'de': 'DE', // German -> Germany
      'fr': 'FR', // French -> France
      'es': 'ES', // Spanish -> Spain
      'it': 'IT', // Italian -> Italy
      'ru': 'RU', // Russian -> Russia
      'lv': 'LV', // Latvian -> Latvia
      'lt': 'LT', // Lithuanian -> Lithuania
      'pl': 'PL', // Polish -> Poland
      'no': 'NO', // Norwegian -> Norway
      'da': 'DK', // Danish -> Denmark
      'nl': 'NL', // Dutch -> Netherlands
    };
    return languageToCountryMap[languageCode.toLowerCase()] || 'GB';
  };

  // Function to render language flags
  const renderLanguageFlags = (languages: string | string[]) => {
    const languageArray = Array.isArray(languages) ? languages : languages?.split(',') || [];
    
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {languageArray.map((lang, index) => {
          const trimmedLang = lang.trim();
          const countryCode = getCountryCodeFromCountry(trimmedLang);
          return (
            <div key={index} className="flex items-center">
              <ReactCountryFlag
                countryCode={countryCode as CountryCode}
                svg
                style={{
                  width: '1.5em',
                  height: '1.5em',
                }}
                title={trimmedLang}
              />
            </div>
          );
        })}
      </div>
    );
  };

  // Function to get country code from language or country name
  const getCountryCodeFromCountry = (input: string): string => {
    const trimmedInput = input.trim();
    
    // If it's already a 2-letter code, return it
    if (trimmedInput.length === 2) {
      return trimmedInput.toUpperCase();
    }
    
    // Map common country names to codes (including variations)
    const countryNameMap: { [key: string]: string } = {
      'estonia': 'EE',
      'estonian': 'EE',
      'eesti': 'EE',
      'eestlane': 'EE',
      'finland': 'FI',
      'finnish': 'FI',
      'suomi': 'FI',
      'sweden': 'SE',
      'swedish': 'SE',
      'sverige': 'SE',
      'germany': 'DE',
      'german': 'DE',
      'deutschland': 'DE',
      'france': 'FR',
      'french': 'FR',
      'spain': 'ES',
      'spanish': 'ES',
      'italy': 'IT',
      'italian': 'IT',
      'russia': 'RU',
      'russian': 'RU',
      'latvia': 'LV',
      'latvian': 'LV',
      'lithuania': 'LT',
      'lithuanian': 'LT',
      'poland': 'PL',
      'polish': 'PL',
      'norway': 'NO',
      'norwegian': 'NO',
      'denmark': 'DK',
      'danish': 'DK',
      'netherlands': 'NL',
      'dutch': 'NL',
      'united states': 'US',
      'usa': 'US',
      'american': 'US',
      'united kingdom': 'GB',
      'uk': 'GB',
      'british': 'GB',
    };
    
    const lowerInput = trimmedInput.toLowerCase();
    
    // Check exact match first
    if (countryNameMap[lowerInput]) {
      return countryNameMap[lowerInput];
    }
    
    // Check if input contains any country name
    for (const [countryName, countryCode] of Object.entries(countryNameMap)) {
      if (lowerInput.includes(countryName) || countryName.includes(lowerInput)) {
        return countryCode;
      }
    }
    
    // If no country match, try language mapping
    const languageResult = getCountryCodeFromLanguage(input);
    return languageResult;
  };


  return (
    <section className="max-w-[1400px] w-full mx-auto my-8">
      <Card className="w-full bg-[#f6f7f9] rounded-[10px] p-5">
        <CardContent className="p-0">
          <h3 className="font-semibold text-xl tracking-[-0.60px] leading-[30px] text-secondary-500 [font-family:'Poppins',Helvetica] mb-5">
            {displayData.title}
          </h3>

          <div className="[font-family:'Poppins',Helvetica] font-normal text-secondary-500 text-lg tracking-[-0.54px] leading-[27px]">
            {displayData.company}
            <br />
            <ReactCountryFlag
              countryCode={displayData.country as CountryCode}
              svg
              style={{
                width: '1.5em',
                height: '1.5em',
                marginRight: '12px',
              }}
              title={displayData.country}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-5">
              <Avatar className="w-[100px] h-[100px] rounded-none">
                <AvatarImage
                  // src={displayData.avatar}
                  src="https://www.clevelanddentalhc.com/wp-content/uploads/2018/03/sample-avatar-300x300.jpg"
                  alt="Seller avatar"
                  className="object-cover"
                />
                <AvatarFallback>SE</AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-1">
                <p className="[font-family:'Poppins',Helvetica] font-medium text-lg text-secondary-500 tracking-[-0.54px] leading-[27px]">
                  {displayData.contactPerson}
                </p>
                <p className="[font-family:'Poppins',Helvetica] font-normal text-lg text-secondary-500 tracking-[-0.54px] leading-[27px]">
                  {displayData.phone}
                </p>
                <p className="[font-family:'Poppins',Helvetica] font-normal text-lg text-secondary-500 tracking-[-0.54px] leading-[27px]">
                  {displayData.email}
                </p>
                <p className="[font-family:'Poppins',Helvetica] font-normal text-lg text-secondary-500 tracking-[-0.54px] leading-[27px]">
                  {displayData.website}
                </p>
                <p className="[font-family:'Poppins',Helvetica] font-normal text-lg text-secondary-500 tracking-[-0.54px] leading-[27px]">
                  {displayData.address}
                </p>
                <div className="[font-family:'Poppins',Helvetica] font-normal text-lg text-secondary-500 tracking-[-0.54px] leading-[27px]">
                  {renderLanguageFlags(displayData.language || '')}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
