import { Heart, Check } from "lucide-react";
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
import { useParams } from "react-router-dom";
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
  modelDetail?: string;
  // Seller information
  businessType?: string;
  country?: string;
  phone?: string;
  email?: string;
  language?: string;
  website?: string;
}

export default function CarPageMobile() {
  const { id } = useParams();
  const [car, setCar] = useState<any>(null);
  const [contacts, setContacts] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to get VAT display text
  const getVatDisplayText = (car: any) => {
    if (!car) return '';

    // If there's no VAT rate or it's empty/null, show "Hind ei sisalda käibemaksu"
    if (!car.vatRate || car.vatRate === '' || car.vatRate === 'null' || car.vatRefundable === 'ei' || car.vatRefundable === 'no') {
      return 'Hind ei sisalda käibemaksu';
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

        // Fetch contact data for this car
        try {
          const contactResponse = await fetch(`/api/contacts/car/${carData.id}`);
          if (contactResponse.ok) {
            const contactData = await contactResponse.json();
            console.log('ContactData:', contactData);
            setContacts(contactData);
          } else {
            console.log('No contact data found for car:', carData.id);
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
      <div className="min-h-screen bg-white font-['Poppins']">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#06d6a0] mx-auto"></div>
            <p className="mt-4 text-secondary-500">Laadimine...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !car) {
    return (
      <div className="min-h-screen bg-white font-['Poppins']">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-secondary-500 mb-4">Viga</h1>
            <p className="text-secondary-500">{error || 'Auto ei leitud'}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Prepare car images array
  const carImages = [
    car.image_1,
    car.image_2,
    car.image_3,
    car.image_4,
    car.image_5,
    car.image_6,
    car.image_7,
    car.image_8,
  ].filter(Boolean) as string[];

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
      value: car.year_value?.toString() || "N/A",
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
    'alarmSystem': 'Häiresüsteem',
    'ambientLighting': 'Ambiente valgustus',
    'appleCarplay': 'Apple CarPlay',
    'armrest': 'Käetugi',
    'hillStartAssist': 'Käivitusabi mäkketõusul',
    'automaticHighBeams': 'Pimestamisvaba kaugtuli',
    'bluetooth': 'Bluetooth',
    'boardComputer': 'Bordcomputer (pardaarvuti)',
    'cdPlayer': 'CD-mängija',
    'electricWindows': 'Elektrilised aknatõstukid'
  };


  const discountPercentage = car.discountPrice && car.price
    ? Math.round(((car.price - car.discountPrice) / car.price) * 100)
    : 0;



  return (
    <div className="min-h-screen  bg-white font-['Poppins']">
      <Header />

      <main className="pb-20">
        {/* Car gallery */}
        <CarGallery
          mainImage={carImages[0]}
          thumbnails={carImages.slice(1)}
          totalImages={carImages.length}
        />
        {/* Car title and breadcrumb */}
        <div className="px-5 mb-4">
          <div className="bg-[#F6F7F9] rounded-[10px] px-5 py-[30px]">
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
            <p className="text-[#747474] text-[14px] font-medium tracking-[0.28px] mb-6">
              Kasutatud autod » {car.brand_name} {car.model_name} » {car.year_value}
            </p>

            <h2 className="text-[#1A202C] text-[16px] font-semibold leading-[150%] tracking-[-0.48px] mb-6">
              Tehnilised andmed
            </h2>

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-x-[20px] gap-y-[20px]">
              <SpecCard
                icon={<CarIcon />}
                label="Läbisõit:"
                value={`${car.mileage.toLocaleString()} km`}
              />
              <SpecCard
                icon={<SpeedometerIcon />}
                label="Võimsus:"
                value={car.power}
              />
              <SpecCard
                icon={<GearboxIcon />}
                label="Käigukast:"
                value={car.transmission}
              />
              <SpecCard
                icon={<CalendarIcon />}
                label="Esmaregistreerimine:"
                value={car.year_value?.toString() || "N/A"}
              />
              <SpecCard icon={<FuelIcon />} label="Kütus:" value={car.fuelType} />
              <SpecCard icon={<UserIcon />} label="Omanike arv:" value={car.ownerCount} />
            </div>
          </div>
        </div>

        {/* Price section */}
        <div className="flex items-center justify-between mb-4 px-8">
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
              <p className="text-[#747474] text-xs tracking-[-0.2px] leading-[16px] mt-1 text-center">
                {getVatDisplayText(car)}
              </p>
            </div>
          </div>
          <div className="ml-4 mt-7">
            <Button
              className="bg-[#06d6a0] text-white rounded-[10px] px-8 py-3 text-sm "
            >
              Saada e-mail
            </Button>
          </div>
        </div>

        {/* Technical data section */}
        <div className="px-5 mb-6">
          <ExpandableSection title="Tehnilised andmed">
            <div className="space-y-3">
              <div className="bg-white rounded-[10px] p-3 flex justify-between">
                <span className="text-[#1A202C] text-sm font-medium">
                  Tehnilised andmed
                </span>
                <span className="text-[#1A202C] text-sm font-normal">
                  {car.technicalData}
                </span>
              </div>
              <div className="bg-white rounded-[10px] p-3 flex justify-between">
                <span className="text-[#1A202C] text-sm font-medium">
                  Kategooria:
                </span>
                <span className="text-[#1A202C] text-sm font-normal">
                  {car.category}
                </span>
              </div>
              <div className="bg-white rounded-[10px] p-3 flex justify-between">
                <span className="text-[#1A202C] text-sm font-medium">
                  Sõiduki number:
                </span>
                <span className="text-[#1A202C] text-sm font-normal">
                  {car.plateNumber}
                </span>
              </div>
              <div className="bg-white rounded-[10px] p-3 flex justify-between">
                <span className="text-[#1A202C] text-sm font-medium">
                  Läbisõit:
                </span>
                <span className="text-[#1A202C] text-sm font-normal">
                  {car.mileage.toLocaleString()} km
                </span>
              </div>
              <div className="bg-white rounded-[10px] p-3 flex justify-between">
                <span className="text-[#1A202C] text-sm font-medium">
                  Töömaht:
                </span>
                <span className="text-[#1A202C] text-sm font-normal">
                  {car.displacement} cm³
                </span>
              </div>
              <div className="bg-white rounded-[10px] p-3 flex justify-between">
                <span className="text-[#1A202C] text-sm font-medium">
                  Võimsus:
                </span>
                <span className="text-[#1A202C] text-sm font-normal">
                  {car.power}
                </span>
              </div>
              <div className="bg-white rounded-[10px] p-3 flex justify-between">
                <span className="text-[#1A202C] text-sm font-medium">
                  Veoskeem:
                </span>
                <span className="text-[#1A202C] text-sm font-normal">
                  {car.drive_type_ee_name}
                </span>
              </div>
              <div className="bg-white rounded-[10px] p-3 flex justify-between">
                <span className="text-[#1A202C] text-sm font-medium">
                  Kütuse tüüp:
                </span>
                <span className="text-[#1A202C] text-sm font-normal">
                  {car.fuelType}
                </span>
              </div>
            </div>
          </ExpandableSection>
        </div>

        {/* High-value features section */}
        {/* <div className="px-5 mb-6">
          <ExpandableSection title="Kõrgema väärtusega lisvarustus">
            <div className="space-y-3">
              {equipmentFeatures.length > 0 ? (
                equipmentFeatures.map((feature, index) => (
                  <div key={index} className="bg-white rounded-[10px] p-3 flex justify-between items-center">
                    <span className="text-[#1A202C] text-sm font-medium">
                      {equipmentDisplayMap[feature.label] || feature.label}
                    </span>
                    <Check className="w-5 h-5 text-black" />
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-[10px] p-3 text-center">
                  <span className="text-[#1A202C] text-sm font-medium text-gray-500">
                    Lisavarustus puudub
                  </span>
                </div>
              )}
            </div>
          </ExpandableSection>
        </div> */}
        <ImageGallerySection car={car} />

        {/* Seller information section */}
        <SpecificationsSection
          sellerData={{
            title: "Müüja andmed",
            company: contacts?.businessType || car.businessType || "ELKE Mustamäe",
            country: contacts?.country || contacts?.country || car.country || "EE",
            address: contacts?.address || car.address || "Tallinn, Mustamäe tee 22",
            contactPerson: "Kontaktisik",
            phone: contacts?.phone || car.phone || "+372 8888 8888",
            email: contacts?.email || car.email || "Näide@elke.ee",
            language: contacts?.language || car.language || "en",
            website: contacts?.website || car.website || "example.com"
          }}
        />

        {/* Related cars section */}

        <VehicleDetailsSection excludeCarId={car.id} />
      </main>

      <Footer />
    </div>
  );
}
