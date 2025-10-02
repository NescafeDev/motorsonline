import { ChevronDownIcon, HeartIcon } from "lucide-react";
import React, { useRef, useEffect, useState } from "react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { ImageGallerySection } from "./sections/ImageGallerySection";
import { RecentListingsSection } from "./sections/RecentListingsSection";
import { SpecificationsSection } from "./sections/SpecificationsSection";
import { VehicleDetailsSection } from "./sections/VehicleDetailsSection/VehicleDetailsSection";
import CarGallery from "./sections/CarGallery";

interface CarPreviewProps {
  formData: any;
  brands: { id: number; name: string }[];
  models: { id: number; name: string }[];
  years: { id: number; value: string }[];
  driveTypes: { id: number; name: string; ee_name: string }[];
  carImages: (File | null)[];
}

export default function CarPreview({ formData, brands, models, years, driveTypes, carImages }: CarPreviewProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [sidebarTop, setSidebarTop] = useState(0);
  const offset = 20; // px from top of viewport

  // Function to get VAT display text
  const getVatDisplayText = (car: any) => {
    if (!car) return '';

    // If there's no VAT rate or it's empty/null, show "Hind ei sisalda käibemaksu"
    if (car.vatRefundable === 'no') {
      return 'Hind ei sisalda käibemaksu';
    }

    // If VAT rate is 24, show "Hind sisaldab käibemaksu 24%"
    return 'Hind sisaldab käibemaksu ' + car.vatRate + '%';
  };

  useEffect(() => {
    function handleScroll() {
      if (!sidebarRef.current || !gridRef.current) return;
      const gridRect = gridRef.current.getBoundingClientRect();
      const sidebarHeight = sidebarRef.current.offsetHeight;
      const gridTop = gridRect.top + window.scrollY;
      const gridBottom = gridRect.bottom + window.scrollY;
      const maxTop = gridBottom - sidebarHeight - gridTop;

      let newTop = window.scrollY + offset - gridTop;
      if (newTop < 0) newTop = 0;
      if (newTop > maxTop) newTop = maxTop;
      setSidebarTop(newTop);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Map form data to car data format
  const getCarData = () => {
    const selectedBrand = brands.find(b => b.id.toString() === formData.brand_id);
    const selectedModel = models.find(m => m.id.toString() === formData.model_id);
    const selectedYear = years.find(y => y.id.toString() === formData.year_id);
    const selectedDriveType = driveTypes.find(d => d.id.toString() === formData.drive_type_id);

    return {
      id: 0, // Preview mode
      brand_name: selectedBrand?.name || '',
      model_name: selectedModel?.name || '',
      year_value: selectedYear?.value ? parseInt(selectedYear.value) : 0,
      month: formData.month || '',
      mileage: parseInt(formData.mileage) || 0,
      power: formData.power || '',
      transmission: formData.transmission || '',
      fuelType: formData.fuelType || '',
      drive_type_id: formData.drive_type_id || '',
      drive_type_ee_name: selectedDriveType?.ee_name || '',
      ownerCount: formData.ownerCount || '',
      displacement: formData.displacement || '',
      technicalData: formData.technicalData || '',
      category: formData.category || '',
      plateNumber: formData.plateNumber || '',
      price: parseFloat(formData.price) || 0,
      discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
      vatRate: formData.vatRate || '24',
      vatRefundable: formData.vatRefundable || '',
      image_1: carImages[0] ? URL.createObjectURL(carImages[0]) : undefined,
      image_2: carImages[1] ? URL.createObjectURL(carImages[1]) : undefined,
      image_3: carImages[2] ? URL.createObjectURL(carImages[2]) : undefined,
      image_4: carImages[3] ? URL.createObjectURL(carImages[3]) : undefined,
      image_5: carImages[4] ? URL.createObjectURL(carImages[4]) : undefined,
      image_6: carImages[5] ? URL.createObjectURL(carImages[5]) : undefined,
      image_7: carImages[6] ? URL.createObjectURL(carImages[6]) : undefined,
      image_8: carImages[7] ? URL.createObjectURL(carImages[7]) : undefined,
      equipment: formData.equipment || '',
      description: formData.description || '',
      businessType: formData.businessType || '',
      country: formData.country || '',
      phone: formData.phone || '',
      email: formData.email || '',
      language: formData.language || '',
    };
  };

  const car = getCarData();

  // Prepare car images array
  const carImagesArray = [
    car.image_1,
    car.image_2,
    car.image_3,
    car.image_4,
    car.image_5,
    car.image_6,
    car.image_7,
    car.image_8,
  ].filter(Boolean) as string[];

  // Vehicle details data
  const vehicleDetails = [
    {
      icon: "/img/car/Car.png",
      label: "Läbisõit:",
      value: `${car.mileage.toLocaleString()} km`,
    },
    {
      icon: "/img/car/Speedometer.png",
      label: "Võimsus:",
      value: car.power,
    },
    {
      icon: "/img/car/gear-box-switch.png",
      label: "Käigukast:",
      value: car.transmission,
    },
    {
      icon: "/img/car/calendar.png",
      label: "Esmaregistreerimine:",
      value: car.year_value?.toString() + " - " + (car.month.length === 1 ? `0${car.month}` : car.month) || "N/A",
    },
    {
      icon: "/img/car/gas_station.png",
      label: "Kütus",
      value: car.fuelType,
    },
    {
      icon: "/img/car/user_profile.png",
      label: "Omanike arv:",
      value: car.ownerCount,
    },
  ];

  // Technical specifications data
  const technicalSpecs = [
    { label: "Tehnilised andmed", value: car.technicalData },
    { label: "Töömaht:", value: car.displacement },
    { label: "Kategooria:", value: car.category },
    { label: "Võimsus:", value: car.power },
    { label: "Sõiduki number:", value: car.plateNumber },
    { label: "Veoskeem:", value: car.drive_type_ee_name },
    { label: "Läbisõit:", value: `${car.mileage.toLocaleString()} km` },
    { label: "Kütuse tüüp:", value: car.fuelType },
  ];

  // Equipment features data - parse from equipment string
  const equipmentFeatures = car.equipment
    ? car.equipment.split(',').map(item => ({
      label: item.trim(),
      icon: "/img/car/check.svg"
    }))
    : [];

  // Calculate discount percentage
  const discountPercentage = car.discountPrice && car.price
    ? Math.round(((car.price - car.discountPrice) / car.price) * 100)
    : 0;

  return (
    <div className="bg-white overflow-hidden w-full flex flex-col items-center">
      {/* Main content */}
      <main className="px-6 lg:px-[100px]">
        {/* Car details and gallery section - Sticky sidebar */}
        <div className="w-full max-w-[1400px] mx-auto">
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
            ref={gridRef}
            style={{ position: "relative" }}
          >
            {/* Left: 2/3 width on md+ screens */}
            <div className="md:col-span-2">
              {/* Main image gallery and sections */}
              <CarGallery
                mainImage={carImagesArray[0] || "/img/placeholder.png"}
                thumbnails={carImagesArray}
                totalImages={carImagesArray.length}
              />
              {/* Technical specifications section */}
              <Card className="w-full mt-10 bg-[#f6f7f9] rounded-[10px] border-none">
                <CardContent className="p-5">
                  <h2 className="font-semibold text-secondary-500 text-xl tracking-[-0.60px] leading-[30px] [font-family:'Poppins',Helvetica] mb-6">
                    Tehnilised andmed
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {technicalSpecs.map((spec, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-[10px] p-2.5 flex justify-between items-center"
                      >
                        <span className="font-medium text-secondary-500 text-lg tracking-[-0.54px] leading-[27px] [font-family:'Poppins',Helvetica]">
                          {spec.label}
                        </span>
                        <span className="font-normal text-secondary-500 text-lg tracking-[-0.54px] leading-[27px] [font-family:'Poppins',Helvetica]">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center mt-8">
                    <Button
                      variant="outline"
                      className="border-[#06d6a0] text-[#06d6a0] rounded-[10px] flex items-center gap-2.5"
                    >
                      Näita rohkem
                      <ChevronDownIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Equipment features section */}
              {equipmentFeatures.length > 0 && (
                <Card className="w-full mt-10 bg-[#f6f7f9] rounded-[10px] border-none">
                  <CardContent className="p-5">
                    <h2 className="font-semibold text-secondary-500 text-xl tracking-[-0.60px] leading-[30px] [font-family:'Poppins',Helvetica] mb-6">
                      Kõrgema väärtusega lisvarustus
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                      {equipmentFeatures.slice(0, 12).map((feature, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-[10px] p-2.5 flex justify-between items-start gap-2"
                        >
                          <span className="font-medium text-secondary-500 text-lg tracking-[-0.54px] leading-[27px] [font-family:'Poppins',Helvetica] break-words flex-1 min-w-0">
                            {feature.label}
                          </span>
                          <div className="w-6 h-6 bg-[100%_100%] flex-shrink-0">
                            <img className="w-6 h-6 " src={feature.icon} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center mt-8">
                      <Button
                        variant="outline"
                        className="border-[#06d6a0] text-[#06d6a0] rounded-[10px] flex items-center gap-2.5"
                      >
                        Näita rohkem
                        <ChevronDownIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Import all required sections */}
              <ImageGallerySection car={car} />
            </div>
            {/* Right: 1/3 width on md+ screens, floating */}
            <div className="md:col-span-1">
              <div
                ref={sidebarRef}
                style={{
                  position: "absolute",
                  top: sidebarTop,
                  // No transition for instant movement
                }}
              >
                {/* Car details card */}
                <Card className="bg-[#f6f7f9] rounded-[10px] border-none">
                  <CardContent className="px-[20px] py-[30px]">
                    <div className="flex justify-between items-start">
                      <h1 className="text-[30px] font-semibold text-secondary-500 tracking-[-1.20px] leading-[60px] [font-family:'Poppins',Helvetica] ">
                        {car.brand_name} {car.model_name}
                      </h1>
                      <Button
                        variant="ghost"
                        className="p-0 mt-3"
                      >
                        <HeartIcon
                          className="w-[29px] h-[29px] text-gray-400 hover:text-red-400"
                        />
                      </Button>
                    </div>

                    <div className="mt-2">
                      <span className="text-[#747474] text-[12px] tracking-[0.34px] leading-[normal] [font-family:'Poppins',Helvetica] font-medium">
                        Kasutatud autod » {car.brand_name} {car.model_name} » {car.year_value}
                      </span>
                    </div>

                    <h2 className="mt-10 font-semibold text-secondary-500 text-[16px] tracking-[-0.54px] leading-[27px] [font-family:'Poppins',Helvetica]">
                      Tehnilised andmed
                    </h2>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-1 mt-6">
                      {vehicleDetails.map((detail, index) => (
                        <div key={index} className="flex items-center w-full">
                          <div className="w-[60px] h-[60px] relative flex-shrink-0">
                            <img
                              className="w-[40px] h-[40px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                              alt={detail.label}
                              src={detail.icon}
                            />
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="font-normal text-secondary-500 text-[12px] tracking-[-0.42px] leading-[21px] [font-family:'Poppins',Helvetica] break-words">
                              {detail.label}
                            </span>
                            <span className="font-medium text-secondary-500 text-[12px] tracking-[-0.54px] leading-[27px] [font-family:'Poppins',Helvetica] break-words">
                              {detail.value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-10 row flex">
                      <div className="col-6 w-full">
                        <div className="flex items-center gap-1">
                          {car.discountPrice && (
                            <>
                              <div className="relative">
                                <span className="font-medium text-[#747474] text-[14px] leading-[normal] [font-family:'Poppins',Helvetica]">
                                  € {car.price.toLocaleString()}
                                </span>
                                <Separator className="absolute w-[40px] top-[12px] -left-1 bg-gray-400" />
                              </div>
                              {
                                discountPercentage != 0 && (
                                  <Badge className="bg-[#ffe5e5] text-[#ff0000] border border-[#ff0000] rounded-[100px] ml-1 mt-1 px-2.5 py-0.4 text-[12px]">
                                    {discountPercentage}%
                                  </Badge>
                                )
                              }
                            </>
                          )}
                        </div>

                        <div className="mt-2">
                          <span className="font-semibold text-secondary-500 text-[24px] leading-[normal] [font-family:'Poppins',Helvetica]">
                            € {(car.discountPrice || car.price).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div
                        className="col-6 w-full relative"
                        style={{ minHeight: "80px" }}
                      >
                        <div className="absolute right-0 bottom-0">
                          <Button
                            className="bg-[#06d6a0] text-white rounded-[10px] px-[30px] py-[15px]"
                          >
                            Saada e-mail
                          </Button>
                          <p className="text-[#747474] text-[10px] tracking-[-0.36px] leading-[18px] [font-family:'Poppins',Helvetica] mt-2">
                            {getVatDisplayText(car)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        {/* Now, OUTSIDE the grid, render the next sections */}
        <SpecificationsSection
          sellerData={{
            title: "Müüja andmed",
            company: car.businessType || "ELKE Mustamäe",
            address: car.country || "Tallinn, Mustamäe tee 22",
            contactPerson: "Kontaktisik",
            phone: car.phone || "+372 8888 8888",
            email: car.email || "Näide@elke.ee",
            language: car.language || "en"
          }}
        />
      </main>
    </div>
  );
}
