import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { Card, CardContent } from "../../../../components/ui/card";

export interface SellerData {
  title: string;
  company?: string;
  address?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  avatar?: string;
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
    email: "Näide@elke.ee"
  };

  // Use provided seller data or fallback to default
  const displayData = sellerData || defaultSellerData;

  return (
    <section className="w-full mx-auto my-8">
      <Card className="w-full bg-[#f6f7f9] rounded-[10px] p-5">
        <CardContent className="p-0">
          <h3 className="font-semibold text-xl tracking-[-0.60px] leading-[30px] text-secondary-500 [font-family:'Poppins',Helvetica] mb-5">
            {displayData.title}
          </h3>

          <div className="[font-family:'Poppins',Helvetica] font-normal text-secondary-500 text-lg tracking-[-0.54px] leading-[27px] mb-7">
            {displayData.company}
            <br />
            {displayData.address}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-5">
              <Avatar className="w-[100px] h-[100px] rounded-none">
                <AvatarImage
                  src={displayData.avatar}
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
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
