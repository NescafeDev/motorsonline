import { ChevronDownIcon, Contact, HeartIcon } from "lucide-react";
import React, { useRef, useEffect, useState } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { ImageGallerySection } from "./sections/ImageGallerySection";
import { RecentListingsSection } from "./sections/RecentListingsSection";
import { SpecificationsSection } from "./sections/SpecificationsSection";
import { VehicleDetailsSection } from "./sections/VehicleDetailsSection/VehicleDetailsSection";
import CarGallery from "./sections/CarGallery";
import { useAuth } from "../../contexts/AuthContext";

interface CarPreviewProps {
  formData: any;
  contactFormData: any;
  checkboxes: any;
  brands: { id: number; name: string }[];
  models: { id: number; name: string }[];
  years: { id: number; value: string }[];
  driveTypes: { id: number; name: string; ee_name: string }[];
  carImages: (File | null)[];
}

export default function CarPreview({ formData, contactFormData, checkboxes, brands, models, years, driveTypes, carImages }: CarPreviewProps) {
  const { t } = useI18n();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [sidebarTop, setSidebarTop] = useState(0);
  const [showAllTechSpecs, setShowAllTechSpecs] = useState(false);
  const [showAllEquipment, setShowAllEquipment] = useState(false);
  const offset = 20; // px from top of viewport
  const { user } = useAuth();
  // Function to get VAT display text
  const getVatDisplayText = (car: any) => {
    if (!car) return '';

    // If there's no VAT rate or it's empty/null, show "Hind ei sisalda käibemaksu"
    if (car.vatRefundable === 'no' || car.vatRefundable === 'ei') {
      return t('vatInfo.vat0NoVatAdded');
    }

    // If VAT rate is 24, show "Hind sisaldab käibemaksu 24%"
    return t('vatInfo.priceIncludesVatWithRate') + ' ' + car.vatRate + '%';
    

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

    console.log(checkboxes);
    // console.log(car.accessories)
    console.log(formData)


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
      modelDetail: formData.modelDetail || '',
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
      images: carImages.map((file, idx) => file ? URL.createObjectURL(file) : '').filter(Boolean),
      equipment: formData.equipment || '',
      description: formData.description || '',
      businessType: contactFormData.businessType || '',
      country: contactFormData.country || '',
      phone: contactFormData.phone || '',
      email: contactFormData.email || '',
      language: contactFormData.language || '',
      website: contactFormData.website || '',
      address: contactFormData.address || '',
      vinCode: formData.vinCode || '',
      doors: formData.doors || '',
      bodyType: formData.bodyType || '',
      salonColor: formData.salonColor || '',
      carColor: formData.carColor || '',
      serviceBook: formData.serviceBook || '',
      lastMaintenance: formData.lastMaintenance || '',
      lastInspection: formData.lastInspection || '',
      inspectionValidityPeriod: formData.inspectionValidityPeriod || '',
      warranty: formData.warranty || '',
      major: formData.major || '',
    };
  };

  const car = getCarData();

  // Prepare car images array
  const carImagesArray = (car.images || []).filter(Boolean) as string[];

  // Vehicle details data
  const vehicleDetails = [
    {
      icon: "/img/car/Car.png",
      label: t('carSpecs.mileage') + ':',
      value: `${car.mileage.toLocaleString()} km`,
    },
    {
      icon: "/img/car/Speedometer.png",
      label: t('carSpecs.power') + ':',
      value: car.power,
    },
    {
      icon: "/img/car/gear-box-switch.png",
      label: t('carSpecs.transmission') + ':',
      value: car.transmission,
    },
    {
      icon: "/img/car/calendar.png",
      label: t('formLabels.firstRegistration') + ':',
      value: car.year_value?.toString() + " - " + (car.month.length === 1 ? `0${car.month}` : car.month) || "N/A",
    },
    {
      icon: "/img/car/gas_station.png",
      label: t('carSpecs.fuel'),
      value: car.fuelType,
    },
    {
      icon: "/img/car/user_profile.png",
      label: t('carSpecs.ownerCount') + ':',
      value: car.ownerCount,
    },
  ];

  // Technical specifications data
  const technicalSpecs = [
    { label: t('formLabels.vehicleCondition') + ':', value: car.technicalData },
    { label: t('formLabels.ownerCountLabel') + ':' , value:car.ownerCount},
    { label: t('formLabels.vinCode') + ':' , value:car.vinCode},
    { label: t('formLabels.vehicleNumber') , value: car.plateNumber },
    { label: t('carSpecs.mileage') + ':', value: `${car.mileage.toLocaleString()} km` },
    { label: t('formLabels.firstRegistration') + ':' , value:(car.month.length === 1 ? `0${car.month}` : car.month) + "." +  car.year_value?.toString() || "N/A"},
    { label: t('formLabels.serviceBook') + ':' , value:car.serviceBook},
    { label: t('formLabels.lastMaintenance') + ':' , value:car.lastMaintenance},
    { label: t('formLabels.lastInspection') + ':' , value:car.lastInspection},
    { label: t('formLabels.inspectionValid') + ':' , value:car.inspectionValidityPeriod},
    { label: t('formLabels.warranty') + ':' , value:car.warranty},
    { label: t('formLabels.powerKw') + ':', value: car.power },
    { label: t('formLabels.displacement') + ':', value: car.displacement },
    { label: t('formLabels.transmissionType') + ':', value: car.transmission },
    { label: t('formLabels.driveType') + ':', value: car.drive_type_ee_name },
    { label: t('formLabels.fuelType') + ':', value: car.fuelType },
    { label: t('formLabels.categoryDesignation') + ':', value: car.category },
    { label: t('formLabels.doors') + ':' , value:car.doors},
    { label: t('formLabels.bodyType') + ':' , value:car.bodyType},
    { label: t('formLabels.interiorColor') + ':' , value:car.salonColor},
    { label: t('formLabels.color') + ':', value: car.carColor },
  ];

  // Equipment features data - get from checkboxes
  const accessoriesOptions = [
    { key: 'kokkupõrgetennetavpidurisüsteem', label: t('carFeatures.collisionPreventionBrakingSystem') },
    { key: 'pimenurgahoiatus', label: 'Pimenurga Hoiatus' },
    { key: 'sõidurajahoidmiseabisüsteem', label: t('carFeatures.laneKeepingAssistSystem') },
    { key: 'sõidurajavahetamiseabisüsteem', label: t('carFeatures.laneChangeAssistSystem') },
    { key: 'adaptiivnepüsikiirusehoidja', label: t('carFeatures.adaptiveCruiseControl') },
    { key: 'liiklusmärkidetuvastusjakuvamine', label: t('carFeatures.trafficSignRecognition') },
    { key: 'parkimisandurideesjataga', label: t('carFeatures.parkingSensorsFrontRear') },
    { key: 'parkimiskaamera', label: t('carFeatures.parkingCamera') },
    { key: 'parkimiskaamera360', label: t('carFeatures.parkingCamera360') },
    { key: 'kaugtuledeümberlülitamiseassistent', label: t('carFeatures.highBeamAssist') },
    { key: 'LEDesituled', label: t('carFeatures.ledHeadlights') },
    { key: 'Xenonesituled', label: t('carFeatures.xenonHeadlights') },
    { key: 'lasersituled', label: t('carFeatures.laserHeadlights') },
    { key: 'elektriliseoojendusegaesiklaas', label: t('carFeatures.heatedWindscreen') },
    { key: 'kliimaseade', label: t('carFeatures.airConditioning') },
    { key: 'salongieelsoojendus', label: t('carFeatures.cabinPreheater') },
    { key: 'mootorieelsoojendus', label: t('carFeatures.enginePreheater') },
    { key: 'salongilisaoojendus', label: t('carFeatures.additionalCabinHeater') },
    { key: 'istmesoojendused', label: t('carFeatures.seatHeating') },
    { key: 'elektriliseltreguleeritavadIstmed', label: t('carFeatures.electricSeats') },
    { key: 'comfortistmed', label: t('carFeatures.comfortSeats') },
    { key: 'sportistmed', label: t('carFeatures.sportSeats') },
    { key: 'nahkpolster', label: t('carFeatures.leatherUpholstery') },
    { key: 'poolnahkpolster', label: t('carFeatures.semiLeatherUpholstery') },
    { key: 'tagaistmeseljatugiallaklapitav', label: t('carFeatures.rearSeatBackFoldable') },
    { key: 'eraldikliimaseadetagaistmetele', label: t('carFeatures.rearSeatIndependentClimate') },
    { key: 'võtmetavamine', label: t('carFeatures.keylessEntry') },
    { key: 'võtmetaKäivitus', label: t('carFeatures.keylessStart') },
    { key: 'pakiruumiavaminejasulgeminelektriliselt', label: t('carFeatures.powerTailgate') },
    { key: 'soojendusegarool', label: t('carFeatures.heatedSteeringWheel') },
    { key: 'ventileeritavadstmed', label: t('carFeatures.ventilatedSeats') },
    { key: 'massaažifunktsioonigaiistmed', label: 'Massaažifunktsiooniga Istmed' },
    { key: 'infokuvamineesiklaasile', label: t('carFeatures.headUpDisplay') },
    { key: 'panoraamkatusklaasist', label: 'Panoraamkatus (klaasist)' },
    { key: 'katuseluuk', label: 'Katuseluuk' },
    { key: 'usteservosulgurid', label: t('carFeatures.softCloseDoors') },
    { key: 'topeltklaasid', label: t('carFeatures.doubleGlazing') },
    { key: 'rulookardinadustel', label: t('carFeatures.doorSunblinds') },
    { key: 'integreeritudVäravapult', label: 'Integreeritud Väravapult' },
    { key: 'AppleCarPlay', label: 'Apple CarPlay' },
    { key: 'AndroidAuto', label: 'Android Auto' },
    { key: 'stereo', label: t('carFeatures.stereo') },
    { key: 'õhkvedrustus', label: t('carFeatures.airSuspension') },
    { key: 'reguleeritavvedrustus', label: t('carFeatures.adjustableSuspension') },
    { key: '4-rattapööramine', label: t('carFeatures.fourWheelSteering') },
    { key: 'veokonks', label: t('carFeatures.towHook') },
    { key: 'elektrilisedliuguksed', label: t('carFeatures.powerSlidingDoors') },
    { key: 'öiseNägemiseassistent', label: t('carFeatures.nightVisionAssistant') },
    { key: 'valgustuspakett', label: 'Valgustuspakett' },
    { key: 'suverehvid', label: 'Suverehvid' },
    { key: 'talverehvid', label: 'Talverehvid' },
    { key: 'valuveljed', label: 'Valuveljed' },
  ];

  const equipmentFeatures = checkboxes 
    ? accessoriesOptions
        .filter(option => checkboxes[option.key])
        .map(option => ({
          label: option.label,
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
      <main className="px-6 lg:px-[100px] 2xl:px-[110px] 2xl:w-[1500px]">
        {/* Car details and gallery section - Sticky sidebar */}
        <div className="w-full mx-auto">
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
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
                    {t('formLabels.technicalSpecs')}
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {(showAllTechSpecs ? technicalSpecs : technicalSpecs.slice(0, 6)).map((spec, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-[10px] p-2.5 flex justify-between items-center"
                      >
                        <span className="font-medium text-secondary-500 text-lg tracking-[-0.54px] leading-[27px] [font-family:'Poppins',Helvetica]">
                          {spec.label}
                        </span>
                        <span className="font-normal text-secondary-500 text-lg tracking-[-0.54px] leading-[27px] [font-family:'Poppins',Helvetica]">
                          {spec.value ? spec.value.charAt(0).toUpperCase() + spec.value.slice(1) : spec.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {technicalSpecs.length > 6 && (
                    <div className="flex justify-center mt-8">
                      <Button
                        variant="outline"
                        className="border-[#06d6a0] text-[#06d6a0] rounded-[10px] flex items-center gap-2.5"
                        onClick={() => setShowAllTechSpecs(!showAllTechSpecs)}
                      >
                        {showAllTechSpecs ? t('formLabels.showLess') : t('formLabels.showMore')}
                        <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${showAllTechSpecs ? 'rotate-180' : ''}`} />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Equipment features section */}
              {equipmentFeatures.length > 0 && (
                <Card className="w-full mt-10 bg-[#f6f7f9] rounded-[10px] border-none">
                  <CardContent className="p-5">
                    <h2 className="font-semibold text-secondary-500 text-xl tracking-[-0.60px] leading-[30px] [font-family:'Poppins',Helvetica] mb-6">
                      {t('formLabels.higherValueAccessories')}
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                      {equipmentFeatures.slice(0, showAllEquipment ? equipmentFeatures.length : 10).map((feature, index) => (
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

                    {equipmentFeatures.length > 10 && (
                      <div className="flex justify-center mt-8">
                        <Button
                          variant="outline"
                          className="border-[#06d6a0] text-[#06d6a0] rounded-[10px] flex items-center gap-2.5"
                          onClick={() => setShowAllEquipment(!showAllEquipment)}
                        >
                          {showAllEquipment ? t('formLabels.showLess') : t('formLabels.showMore')}
                          <ChevronDownIcon className={`w-4 h-4 transition-transform ${showAllEquipment ? 'rotate-180' : ''}`} />
                        </Button>
                      </div>
                    )}
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
                  top: sidebarTop,
                  // No transition for instant movement
                }}
              >
                {/* Car details card */}
                <Card className="bg-[#f6f7f9] rounded-[10px] border-none">
                  <CardContent className="px-[20px] py-[30px]">
                    <div className="flex justify-between items-start">
                      <h1 className="text-[26px] font-medium text-secondary-500 tracking-[-1.50px] [font-family:'Poppins',Helvetica] ">
                        {car.brand_name} {car.model_name} {car.modelDetail}
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
                    <span className="text-black text-[20px] tracking-[0.34px] leading-[normal] [font-family:'Poppins',Helvetica] font-medium">
                      {car.major && car.major.length > 50 ? `${car.major.substring(0, 50)}...` : car.major}
                    </span>
                    <div className="mt-2">
                      <span className="text-[#747474] text-[12px] tracking-[0.34px] leading-[normal] [font-family:'Poppins',Helvetica] font-medium">
                        {car.technicalData} » {car.brand_name} {car.model_name} » {car.year_value}
                      </span>
                    </div>

                    <h2 className="mt-10 font-semibold text-secondary-500 text-[16px] tracking-[-0.54px] leading-[27px] [font-family:'Poppins',Helvetica]">
                      {t('formLabels.technicalSpecs')}
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
                              {/* {detail.label} */}
                            </span>
                            <span className="font-medium text-secondary-500 text-[12px] tracking-[-0.54px] leading-[27px] [font-family:'Poppins',Helvetica] break-words">
                              {detail.value ? detail.value.charAt(0).toUpperCase() + detail.value.slice(1) : detail.value}
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
                          <p className="text-[#747474] text-[10px] tracking-[-0.36px] leading-[18px] [font-family:'Poppins',Helvetica] mt-2">
                            {getVatDisplayText(car)}
                          </p>
                        </div>
                      </div>
                      <div
                        className="col-6 w-full relative"
                        style={{ minHeight: "80px" }}
                      >
                        <div className="absolute right-0 bottom-6">
                          <Button
                            className="bg-[#06d6a0] text-white rounded-[10px] px-[15px] py-[15px]"
                          >
                            {t('formLabels.sendEmail')}
                          </Button>
                          
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
            title: t('formLabels.seller'),
            company: contactFormData.businessType || "ELKE Mustamäe",
            country: contactFormData.country || "EE",
            address: contactFormData.address || "Tallinn, Mustamäe tee 22",
            contactPerson: user?.userType || "Eraisik",
            phone: contactFormData.phone || "+372 8888 8888",
            email: contactFormData.email || "Näide@elke.ee",
            language: contactFormData.language || "en",
            website: contactFormData.website || "example.com"
          }}
        />
      </main>
    </div>
  );
}
