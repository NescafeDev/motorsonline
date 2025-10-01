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
  };
  const options = useMemo(() => countryList().getData(), []);

  // Use provided seller data or fallback to default
  const displayData = sellerData || defaultSellerData;

  console.log(displayData)

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
              countryCode={displayData.address as CountryCode}
              svg
              style={{
                width: '1.5em',
                height: '1.5em',
                marginRight: '12px',
              }}
              title={displayData.address}
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
                  {/* {getLanguageName(displayData.language || '')} */}
                  {/* {displayData.language.replace(/,/g, " , ")} */}
                  {Array.isArray(displayData.language) ? displayData.language.join(', ') : displayData.language?.replace(/,/g, " , ") || ''}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
