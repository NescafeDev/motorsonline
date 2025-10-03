import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { Separator } from "../../../../components/ui/separator";

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
  image_1?: string;
  image_2?: string;
  image_3?: string;
  image_4?: string;
  image_5?: string;
  image_6?: string;
  image_7?: string;
  image_8?: string;
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
  
  return (
    <section className="w-full max-w-[1240px] mx-auto my-8">
      <Card className="bg-[#f6f7f9] rounded-[10px] p-5">
        <CardContent className="p-0 space-y-8">
          {/* Equipment */}
          <div className="space-y-4">
            <h2 className="font-['Poppins',Helvetica] font-semibold text-secondary-500 text-lg tracking-[-0.60px] leading-[30px]">
              Varustus:
            </h2>
            <ul className="font-['Poppins',Helvetica] font-normal text-secondary-500 text-lg tracking-[-0.54px] leading-[27px] pl-6 space-y-2">
              {car?.equipment && car.equipment.trim() ? (
                car.equipment.split(/\r?\n|\r|\n/g).map((item, index) => (
                  // <li key={index} className="break-words leading-relaxed py-1">{item.trim()}</li>
                  <li key={index} className="break-all leading-relaxed">{
                      item.trim().includes('•') ? (
                        item.trim()
                      ) : (
                        <p className="font-semibold mt-5">{item.trim()}</p>
                      )
                    }</li>
                  // <li key={index} className="break-words">asd</li>
                ))
              ) : (
                <li>Varustuse andmed puuduvad</li>
              )}
            </ul>
          </div>
          {/* Vehicle description */}
          <div className="space-y-4">
            <h2 className="font-['Poppins',Helvetica] font-semibold text-secondary-500 text-lg tracking-[-0.60px] leading-[30px]">
              Sõiduki kirjeldus müüja poolt
            </h2>
            <div className="font-['Poppins',Helvetica] font-normal text-secondary-500 text-lg tracking-[-0.54px] leading-[27px]">
              {car?.description && car.description.trim() ? (
                // <p className="break-words">{car.description}</p>
                <p className="break-all leading-relaxed py-1">{car.description}</p>
              ) : (
                <p>Kirjeldus puudub</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
