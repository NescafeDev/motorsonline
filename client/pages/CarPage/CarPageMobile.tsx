import { Heart, Check, MapPin, ChevronDownIcon, Divide } from "lucide-react";
import Header from "@/components/mobile/Header";
import CarGallery from "@/components/mobile/CarGallery";
import SpecCard from "@/components/mobile/SpecCard";
import PriceSection from "@/components/mobile/PriceSection";
import ExpandableSection from "@/components/mobile/ExpandableSection";
import { CarCard } from "@/components/mobile/CarCard";
import Footer from "@/components/mobile/Footer";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import {
  CarIcon,
  GearboxIcon,
  CalendarIcon,
  UserIcon,
  SpeedometerIcon,
  FuelIcon,
} from "@/components/mobile/CarIcons";
import { ImageGallerySection } from "./sections/ImageGallerySection/ImageGallerySection";
import { useI18n } from "@/contexts/I18nContext";
import { Form, useParams } from "react-router-dom";
import { useFavorites } from "../../hooks/useFavorites";
import { useAuth } from "../../contexts/AuthContext";
import { useViews } from "../../hooks/useViews";
import { useState, useEffect } from "react";
import { VehicleDetailsSection } from "./sections/VehicleDetailsSection/VehicleDetailsSection";
import { SpecificationsSection } from "./sections/SpecificationsSection/SpecificationsSection";


interface CarData {
  id: number;
  brand_name?: string;
  model_name?: string;
  year_value?: number;
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
  accessories?: string;
  price: number;
  discountPrice?: number;
  vatRate?: string;
  vatRefundable?: string;
  images?: string[];
  equipment?: string;
  description?: string;
  created_at?: string;
  modelDetail?: string;
  major?: string;
  vinCode?: string;
  doors?: string;
  bodyType?: string;
  salonColor?: string;
  carColor?: string;
  address?: string;
  serviceBook?: string;
  lastMaintenance?: string;
  lastInspection?: string;
  inspectionValidityPeriod?: string;
  warranty?: string;
  // Seller information
  businessType?: string;
  country?: string;
  phone?: string;
  email?: string;
  language?: string;
  website?: string;
}

export default function CarPageMobile() {
  const { t } = useI18n();
  const { id } = useParams();
  const [car, setCar] = useState<any>(null);
  const [contacts, setContacts] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllTechSpecs, setShowAllTechSpecs] = useState(false);
  const [showAllEquipment, setShowAllEquipment] = useState(false);
  const { user } = useAuth();

  // Function to get VAT display text
  const getVatDisplayText = (car: any) => {
    if (!car) return '';

    // If there's no VAT rate or it's empty/null, show "Hind ei sisalda käibemaksu"
    if (!car.vatRate || car.vatRate === '' || car.vatRate === 'null' || car.vatRefundable === 'ei' || car.vatRefundable === 'no') {
      return t('vatInfo.vat0NoVatAdded');
    }
    // If VAT rate is 24, show "Hind sisaldab käibemaksu 24%"
    // if (car.vatRate === '24') {
    //   return 'Hind sisaldab käibemaksu 24%';
    // }

    // For any other VAT rate, show the specific rate
    return `Hind sisaldab käibemaksu ${car.vatRate}%`;
  };

  // Favorites functionality
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { incrementView } = useViews();

  // Fetch car data
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
        setCar(carData);

        // Fetch contact data for this car's owner
        try {
          const contactResponse = await fetch(`/api/contacts/public/${carData.user_id}`);
          if (contactResponse.ok) {
            const contactData = await contactResponse.json();
            console.log('ContactData:', contactData);
            setContacts(contactData);
          } else {
            console.log('No contact data found for user:', carData.user_id);
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
      <div className="min-h-screen bg-white font-['Poppins'] w-full">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#06d6a0] mx-auto"></div>
            <p className="mt-4 text-secondary-500">{t('common.loading')}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !car) {
    return (
      <div className="min-h-screen bg-white font-['Poppins'] w-full">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-secondary-500 mb-4">{t('common.error')}</h1>
            <p className="text-secondary-500">{error || t('common.carNotFound')}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Prepare car images array
  const carImages = (car.images || []).filter(Boolean) as string[];

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
      value: car.year_value?.toString() || "N/A",
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

  const technicalSpecs = [
    { label: t('formLabels.vehicleCondition') + ':', value: car.technicalData },
    { label: t('formLabels.ownerCountLabel') + ':', value: car.ownerCount },
    { label: t('formLabels.vinCode') + ':', value: car.vinCode },
    { label: t('formLabels.vehicleNumber'), value: car.plateNumber },
    { label: t('carSpecs.mileage') + ':', value: `${car.mileage.toLocaleString()} km` },
    { label: t('formLabels.firstRegistration') + ':', value: (car.month.length === 1 ? `0${car.month}` : car.month) + "." + car.year_value?.toString() || "N/A" },
    { label: t('formLabels.serviceBook') + ':', value: car.serviceBook },
    { label: t('formLabels.lastMaintenance') + ':', value: car.lastMaintenance },
    { label: t('formLabels.lastInspection') + ':', value: car.lastInspection },
    { label: t('formLabels.inspectionValid') + ':', value: car.inspectionValidityPeriod },
    { label: t('formLabels.warranty') + ':', value: car.warranty },
    { label: t('formLabels.powerKw') + ':', value: car.power },
    { label: t('formLabels.displacement') + ':', value: car.displacement },
    { label: t('formLabels.transmissionType') + ':', value: car.transmission },
    { label: t('formLabels.driveType') + ':', value: car.drive_type_ee_name },
    { label: t('formLabels.fuelType') + ':', value: car.fuelType },
    { label: t('formLabels.categoryDesignation') + ':', value: car.category },
    { label: t('formLabels.doors') + ':', value: car.doors },
    { label: t('formLabels.bodyType') + ':', value: car.bodyType },
    { label: t('formLabels.interiorColor') + ':', value: car.salonColor },
    { label: t('formLabels.color') + ':', value: car.carColor },
  ];




  const equipmentFeatures = car.accessories
    ? car.accessories.split(',').map(item => ({
      label: item.trim(),
      icon: "/img/car/check.svg"
    }))
    : [];

  // Map equipment features to display names
  const equipmentDisplayMap: { [key: string]: string } = {
    'abs': 'ABS',
    'adaptiveHeadlights': 'Adaptiivne kurvituli',
    'alarmSystem': t('carFeatures.alarmSystem'),
    'ambientLighting': 'Ambiente valgustus',
    'appleCarplay': 'Apple CarPlay',
    'armrest': t('carFeatures.armrest'),
    'hillStartAssist': t('carFeatures.hillStartAssist'),
    'automaticHighBeams': 'Pimestamisvaba kaugtuli',
    'bluetooth': 'Bluetooth',
    'boardComputer': 'Bordcomputer (pardaarvuti)',
    'cdPlayer': t('carFeatures.cdPlayer'),
    'electricWindows': t('carFeatures.electricWindows')
  };


  const discountPercentage = car.discountPrice && car.price
    ? Math.round(((car.price - car.discountPrice) / car.price) * 100)
    : 0;



  return (
    <div className="min-h-screen  bg-white font-['Poppins'] w-full xl:w-full">
      <Header />

      <main className="pb-20">
        {/* Car gallery */}
        <CarGallery
          mainImage={carImages[0]}
          thumbnails={carImages}
          totalImages={carImages.length}
        />
        {/* Car title and breadcrumb */}
        <div className="px-5 mb-4">
          <div className="bg-[#F6F7F9] rounded-[10px] px-5 py-[15px]">
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-[#1A202C] text-[26px] font-semibold leading-[150%] tracking-[-0.78px]">
                {car.brand_name} {car.model_name} {car.modelDetail}
              </h1>
              <Heart
                className={`w-6 h-6 transition-colors duration-200 cursor-pointer ${isFavorite(car.id)
                  ? "text-red-500 fill-red-500"
                  : "text-gray-400 hover:text-red-400"
                  }`}
                onClick={handleHeartClick}
              />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-[#747474] text-[14px] font-medium tracking-[0.28px]">
                {car.major && car.major.length > 50 ? `${car.major.substring(0, 50)}...` : car.major}
              </h3>
            </div>
            <p className="text-[#747474] text-[14px] font-medium tracking-[0.28px] mb-6">
              {car.technicalData ? car.technicalData.charAt(0).toUpperCase() + car.technicalData.slice(1) : car.technicalData} » {car.brand_name} {car.model_name} » {car.year_value}
            </p>

            <h2 className="text-[#1A202C] text-[16px] font-semibold leading-[150%] tracking-[-0.48px] mb-6">
              {t('formLabels.technicalSpecs')}
            </h2>

            {/* Specs grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-[20px] gap-y-[20px]">
              <SpecCard
                icon={<CarIcon />}
                label={t('carSpecs.mileage') + ':'}
                value={`${car.mileage.toLocaleString()} km`}
              />
              <SpecCard
                icon={<CalendarIcon />}
                label={t('carSpecs.firstRegistration') + ':'}
                value={car.year_value?.toString() + " - " + (car.month.length === 1 ? `0${car.month}` : car.month) || "N/A"}
              />
              <SpecCard
                icon={<SpeedometerIcon />}
                label={t('carSpecs.power') + ':'}
                value={`${car.power} kw`}
              />
              <SpecCard 
                icon={<FuelIcon />} 
                label={t('carSpecs.fuel') + ':'} 
                value={car.fuelType ? car.fuelType.charAt(0).toUpperCase() + car.fuelType.slice(1) : car.fuelType} 
              />
              <SpecCard
                icon={<GearboxIcon />}
                label={t('carSpecs.transmission') + ':'}
                value={car.transmission ? car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1) : car.transmission}
              />
              <SpecCard icon={<UserIcon />} label={t('carSpecs.ownerCount') + ':'} value={car.ownerCount} />
            </div>
            <Separator className="my-3" />
            <div className="flex items-center gap-2 mx-1 my-3 pt-3 justify-start h-[20px]">
              <MapPin className="w-5 h-5 text-secondary-500 flex-shrink-0" />
              <div className="flex flex-col">
                <div className="font-medium text-secondary-500 text-sm tracking-[-0.3px] leading-[20px]">
                  {contacts.businessType}
                </div>
                <div className="font-medium text-secondary-500 text-sm tracking-[-0.3px] leading-[20px]">
                  {contacts.address}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price section */}
        <div className="flex items-center justify-between mb-4 px-6">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {car.discountPrice && (
                <>
                  <div className="relative">
                    <span className="font-medium text-[#747474] text-sm leading-[20px]">
                      € {car.price.toLocaleString()}
                    </span>
                    <Separator className="absolute w-[40px] top-[10px] -left-1 bg-gray-400" />
                  </div>
                  {discountPercentage != 0 && (
                    <Badge className="bg-[#ffe5e5] text-[#ff0000] border border-[#ff0000] rounded-[100px] px-2 py-1 text-xs">
                      {discountPercentage}%
                    </Badge>
                  )}
                </>
              )}
            </div>
            <div className="mt-1">
              <span className="font-semibold text-secondary-500 text-2xl leading-[32px]">
                € {(car.discountPrice || car.price).toLocaleString()}
              </span>
              <p className="text-[#747474] text-xs tracking-[-0.2px] leading-[16px] mt-1 text-start">
                {getVatDisplayText(car)}
              </p>
            </div>
          </div>
          <div className="pl-4 item-center">
            <Button
              className="bg-[#06d6a0] text-white rounded-[10px] px-4 py-3"
            >
              {t('formLabels.sendEmail')}
            </Button>
          </div>
        </div>

        {/* Technical data section */}
        <div className="px-5 mb-6">
          <ExpandableSection title={t('formLabels.technicalSpecs')}>
            <div className="space-y-3">
              {(showAllTechSpecs ? technicalSpecs : technicalSpecs.slice(0, 6)).map((spec, index) => (
                <div key={index} className="bg-white rounded-[10px] p-3 flex justify-between">
                  <span className="text-[#1A202C] text-sm font-medium">
                    {spec.label}
                  </span>
                  <span className="text-[#1A202C] text-sm font-normal">
                    {spec.value ? spec.value.charAt(0).toUpperCase() + spec.value.slice(1) : spec.value}
                  </span>
                </div>
              ))}
            </div>

            {technicalSpecs.length > 6 && (
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  className="border-[#06d6a0] text-[#06d6a0] rounded-[10px] flex items-center gap-2 px-4 py-2"
                  onClick={() => setShowAllTechSpecs(!showAllTechSpecs)}
                >
                  {showAllTechSpecs ? t('formLabels.showLess') : t('formLabels.showMore')}
                  <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${showAllTechSpecs ? 'rotate-180' : ''}`} />
                </Button>
              </div>
            )}
          </ExpandableSection>
        </div>

        {/* Equipment features section */}
        {equipmentFeatures.length > 0 && (
          <div className="px-5 mb-4">
            <div className="bg-[#f6f7f9] rounded-[10px] p-5">
              <h2 className="font-semibold text-secondary-500 text-xl tracking-[-0.60px] leading-[30px] [font-family:'Poppins',Helvetica] mb-6">
                {t('formLabels.higherValueAccessories')}
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {equipmentFeatures.slice(0, showAllEquipment ? equipmentFeatures.length : 6).map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-[10px] p-2.5 flex justify-between items-start gap-2"
                  >
                    <span className="font-medium text-secondary-500 text-lg tracking-[-0.54px] leading-[20px] [font-family:'Poppins',Helvetica] break-words flex-1 min-w-0">
                      {feature.label ? feature.label.charAt(0).toUpperCase() + feature.label.slice(1) : feature.label}
                    </span>
                    <div className="w-6 h-6 bg-[100%_100%] flex-shrink-0">
                      <img className="w-6 h-6 " src={feature.icon} />
                    </div>
                  </div>
                ))}
              </div>

              {equipmentFeatures.length > 6 && (
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
            </div>
          </div>
        )}

        <ImageGallerySection car={car} />

        {/* Seller information section */}
        <SpecificationsSection
          sellerData={{
            title: t('formLabels.sellerData'),
            company: contacts?.businessType || "ELKE Mustamäe",
            country: contacts?.country || "EE",
            address: contacts?.address || "Tallinn, Mustamäe tee 22",
            contactPerson: user?.userType || "Eraisik",
            phone: contacts?.phone || "+372 8888 8888",
            email: contacts?.email || "Näide@elke.ee",
            language: contacts?.language || "en",
            website: contacts?.website || "example.com"
          }}
        />

        {/* Related cars section */}

        <VehicleDetailsSection excludeCarId={car.id} />
      </main>

      <Footer />
    </div>
  );
}
