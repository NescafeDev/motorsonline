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
import PageContainer from "../../components/PageContainer";
import CarGallery from "./sections/CarGallery";
import { useParams } from "react-router-dom";
import { useFavorites } from "../../hooks/useFavorites";
import { useAuth } from "../../contexts/AuthContext";
import { useViews } from "../../hooks/useViews";
import { useI18n } from "@/contexts/I18nContext";

interface CarData {
  id: number;
  brand_name?: string;
  model_name?: string;
  year_value?: number;
  month?: string;
  mileage: number;
  power: string;
  transmission: string;
  fuelType: string;
  drive_type_id: string;
  drive_type_ee_name: string;
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
  accessories?: string;
  modelDetail?: string;
  major?: string;
  vinCode?: string;
  doors?: string;
  salonColor?: string;
  bodyType?: string;
  color?: string;
  // Seller information
  businessType?: string;
  country?: string;
  address?: string;
  phone?: string;
  email?: string;
  language?: string;
  website?: string;
}

export default function CarPage() {
  const { t } = useI18n();

  // Gallery images
  const galleryImages = [
    { src: "/view.svg", main: true },
    { src: "/view-1.svg", active: true },
    { src: "/view-2.png" },
    { src: "/view-3.png", more: "+12" },
  ];

  // Function to get VAT display text
  const getVatDisplayText = (car: CarData | null) => {
    if (!car) return '';

    // If there's no VAT rate or it's empty/null, show "Hind ei sisalda käibemaksu"
    if (car.vatRefundable === 'no' || car.vatRefundable === 'ei') {
      return t('vatInfo.vat0NoVatAdded');
    }

    // If VAT rate is 24, show "Hind sisaldab käibemaksu 24%"
    // if (car.vatRate === '24') {
    return t('vatInfo.priceIncludesVatWithRate') + ' ' + car.vatRate + '%';
    // }

    // For any other VAT rate, show the specific rate
    // return `Hind sisaldab käibemaksu ${car.vatRate}%`;
  };

  // Navigation items
  const navItems = ["Lorem ipsum", "Lorem ipsum", "Lorem ipsum"];

  const sidebarRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [sidebarTop, setSidebarTop] = useState(0);
  const offset = 20; // px from top of viewport

  const { id } = useParams();
  const [car, setCar] = useState<CarData | null>(null);
  const [contacts, setContacts] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllTechSpecs, setShowAllTechSpecs] = useState(false);
  const { user } = useAuth();


  // Favorites functionality
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { incrementView } = useViews();

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

  useEffect(() => {
    if (!id) return;

    const fetchCarData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/cars/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Car not found or not approved');
          }
          throw new Error('Failed to fetch car data');
        }

        const carData = await response.json();
        console.log('CarData:', carData);
        setCar(carData);

        // Fetch contact data for this car's owner
        try {
          const contactResponse = await fetch(`/api/contacts/public/${carData.user_id}`);
          if (contactResponse.ok) {
            const contactData = await contactResponse.json();
            setContacts(contactData);
          } else {
            const errorText = await contactResponse.text();
            console.log('No contact data found for user:', carData.user_id, 'Status:', contactResponse.status, 'Error:', errorText);
            setContacts(null);
          }
        } catch (contactError) {
          console.log('Error fetching contact data:', contactError);
          setContacts(null);
        }

        // Increment view count when car data is successfully loaded
        try {
          await incrementView(carData.id);
        } catch (error) {
          console.error('Failed to increment view count:', error);
        }
      } catch (err: any) {
        console.error('Error fetching car:', err);
        setError(err.message || 'Failed to load car data');
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, [id]);

  // Handle heart icon click
  const handleHeartClick = async () => {
    if (!car) return;

    if (!isAuthenticated) {
      alert('Please log in to save favorites');
      return;
    }

    try {
      await toggleFavorite(car.id);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorite status');
    }
  };

  // Loading state
  if (loading) {
    return (
      <PageContainer>
        <div className="bg-white overflow-hidden w-full flex flex-col items-center">
          <div className="px-6 lg:px-[100px] w-full max-w-[1400px] mx-auto py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#06d6a0] mx-auto"></div>
              <p className="mt-4 text-secondary-500">Laadimine...</p>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Error state
  if (error || !car) {
    return (
      <PageContainer>
        <div className="bg-white overflow-hidden w-full flex flex-col items-center">
          <div className="px-6 lg:px-[100px] w-full max-w-[1400px] mx-auto py-20">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-secondary-500 mb-4">Viga</h1>
              <p className="text-secondary-500">{error || 'Auto ei leitud'}</p>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Prepare car images array
  const carImages = (car.images || []).filter(Boolean) as string[];

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
      label: t('carSpecs.firstRegistration') + ':',
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
    { label: t('formLabels.displacement') + ':', value: car.displacement },
    { label: t('formLabels.categoryDesignation') + ':', value: car.category },
    { label: t('formLabels.powerKw') + ':', value: car.power },
    { label: t('formLabels.vehicleNumber') , value: car.plateNumber },
    { label: t('formLabels.driveType') + ':', value: car.drive_type_ee_name },
    { label: t('carSpecs.mileage') + ':', value: `${car.mileage.toLocaleString()} km` },
    { label: t('formLabels.fuelType') + ':', value: car.fuelType },
    { label: t('formLabels.ownerCountLabel') + ':' , value:car.ownerCount},
    { label: t('formLabels.vinCode') + ':' , value:car.vinCode},
    { label: t('formLabels.year') + ':' , value:car.year_value},
    { label: t('formLabels.doors') + ':' , value:car.doors},
    { label: t('formLabels.bodyType') + ':' , value:car.bodyType},
    { label: t('formLabels.interiorColor') + ':' , value:car.salonColor},
    { label: t('formLabels.color') + ':' , value:car.color},
  ];

  // Equipment features data - parse from equipment string
  const equipmentFeatures = car.accessories
    ? car.accessories.split(',').map(item => ({
      label: item.trim(),
      icon: "/img/car/check.svg"
    }))
    : [];

  // Calculate discount percentage
  const discountPercentage = car.discountPrice && car.price
    ? Math.round(((car.price - car.discountPrice) / car.price) * 100)
    : 0;

  return (
    <PageContainer>
      <div className="bg-white overflow-hidden w-full flex flex-col items-center">
        {/* Main content */}
        <main className="px-6 lg:px-[100px]">
          {/* Car details and gallery section - Sticky sidebar */}
          <div className="w-full max-w-[1400px] mx-auto">
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-5"
              ref={gridRef}
              style={{ position: "relative" }}
            >
              {/* Left: 2/3 width on md+ screens */}
              <div className="md:col-span-2">
                {/* Main image gallery and sections */}
                <CarGallery
                  mainImage={carImages[0] || "/img/placeholder.png"}
                  thumbnails={carImages}
                  totalImages={carImages.length}
                />
                {/* Technical specifications section */}
                <Card className="w-full mt-10 bg-[#f6f7f9] rounded-[10px] border-none">
                  <CardContent className="p-5">
                    <h2 className="font-semibold text-secondary-500 text-xl tracking-[-0.60px] leading-[30px] [font-family:'Poppins',Helvetica] mb-6">
                      {t('formLabels.technicalSpecs')}
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                      {(showAllTechSpecs ? technicalSpecs : technicalSpecs.slice(0, 6)).map((spec, index) => (
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
                          {t('formLabels.showMore')}
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
                    transition: "top 0.2s",
                  }}
                >
                  {/* Car details card */}
                  <Card className="bg-[#f6f7f9] rounded-[10px] border-none">
                    <CardContent className="px-[20px] py-[30px]">
                      <div className="flex justify-between items-start">
                        <h1 className="text-[30px] font-semibold text-secondary-500 tracking-[-1.20px] leading-[60px] [font-family:'Poppins',Helvetica] ">
                          {car.brand_name} {car.model_name} {car.modelDetail}
                        </h1>

                        <Button
                          variant="ghost"
                          className="p-0 mt-3"
                          onClick={handleHeartClick}
                        >
                          <HeartIcon
                            className={`w-[29px] h-[29px] transition-colors duration-200 ${isFavorite(car.id)
                              ? "text-red-500 fill-red-500"
                              : "text-gray-400 hover:text-red-400"
                              }`}
                          />
                        </Button>
                      </div>
                      <span className="text-black text-[20px] tracking-[0.34px] leading-[normal] [font-family:'Poppins',Helvetica] font-medium">
                        {car.major}
                      </span>
                      <div className="mt-2">
                        <span className="text-[#747474] text-[12px] tracking-[0.34px] leading-[normal] [font-family:'Poppins',Helvetica] font-medium">
                          Kasutatud autod » {car.brand_name} {car.model_name} » {car.year_value}
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
                                {detail.label}
                              </span>
                              <span className="font-medium text-secondary-500 text-[12px] tracking-[-0.54px] leading-[27px] [font-family:'Poppins',Helvetica] break-words">
                                {detail.value}{ }
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
                            <a href={`mailto:${contacts?.email || car.email || 'futuresea.dev@gmail.com'}`}>
                              <Button
                                onClick={() => {
                                  window.open(`mailto:${contacts?.email || car.email || 'futuresea.dev@gmail.com'}`);
                                }}
                                className="bg-[#06d6a0] text-white rounded-[10px] px-[30px] py-[15px]"
                              >
                                {t('formLabels.sendEmail')}
                              </Button>

                            </a>
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
              company: contacts?.businessType || car.businessType || "ELKE Mustamäe",
              country: contacts?.country || car.country || "EE",
              phone: contacts?.phone || car.phone || "+372 8888 8888",
              contactPerson: user?.userType || "Eraisik",
              email: contacts?.email || car.email || "Näide@elke.ee",
              language: contacts?.language || car.language || "en",
              website: contacts?.website || car.website || "example.com",
              address: contacts?.address || car.address || "Tallinn, Mustamäe tee 22"
            }}
          />
          <VehicleDetailsSection excludeCarId={car.id} />
        </main>
      </div>
    </PageContainer>
  );
}
