import { Heart, Check } from "lucide-react";
import Header from "@/components/mobile/Header";
import CarGallery from "@/components/mobile/CarGallery";
import SpecCard from "@/components/mobile/SpecCard";
import PriceSection from "@/components/mobile/PriceSection";
import ExpandableSection from "@/components/mobile/ExpandableSection";
import { CarCard } from "@/components/mobile/CarCard";
import Footer from "@/components/mobile/Footer";
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

export default function CarPageMobile() {
  const { id } = useParams();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to get VAT display text
  const getVatDisplayText = (car: any) => {
    if (!car) return '';
    
    // If there's no VAT rate or it's empty/null, show "Hind ei sisalda käibemaksu"
    if (!car.vatRate || car.vatRate === '' || car.vatRate === 'null') {
      return 'Hind ei sisalda käibemaksu';
    }
    
    // If VAT rate is 24, show "Hind sisaldab käibemaksu 24%"
    if (car.vatRate === '24') {
      return 'Hind sisaldab käibemaksu 24%';
    }
    
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

  const relatedCars = [
    {
      id: 1,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/1990e9147faccc75e4f4487358e1c8f3e0fd318f?width=780",
      title: "Volkswagen Touareg",
      year: 2016,
      mileage: "303 000 km",
      fuel: "Diisel",
      transmission: "Automaat",
      price: "€ 15 900",
    },
    {
      id: 2,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/1990e9147faccc75e4f4487358e1c8f3e0fd318f?width=780",
      title: "Volkswagen Touareg",
      year: 2016,
      mileage: "303 000 km",
      fuel: "Diisel",
      transmission: "Automaat",
      price: "€ 15 900",
    },
    {
      id: 3,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/1990e9147faccc75e4f4487358e1c8f3e0fd318f?width=780",
      title: "Volkswagen Touareg",
      year: 2016,
      mileage: "303 000 km",
      fuel: "Diisel",
      transmission: "Automaat",
      price: "€ 15 900",
    },
    {
      id: 4,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/1990e9147faccc75e4f4487358e1c8f3e0fd318f?width=780",
      title: "Volkswagen Touareg",
      year: 2016,
      mileage: "303 000 km",
      fuel: "Diisel",
      transmission: "Automaat",
      price: "€ 15 900",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-['Poppins']">
      <Header />

      <main className="pb-20">
        {/* Car gallery */}
        <CarGallery
          mainImage={carImages[0]}
          thumbnails={carImages.slice(1)}
          totalImages={15}
        />
        {/* Car title and breadcrumb */}
        <div className="px-5 mb-4">
          <div className="bg-[#F6F7F9] rounded-[10px] px-5 py-[30px]">
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-[#1A202C] text-[26px] font-semibold leading-[150%] tracking-[-0.78px]">
                {car.brand_name} {car.model_name}
              </h1>
              <Heart 
                className={`w-6 h-6 transition-colors duration-200 cursor-pointer ${
                  isFavorite(car.id) 
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
                value="20 350 km"
              />
              <SpecCard
                icon={<SpeedometerIcon />}
                label="Võimsus:"
                value="533 kW (725 hj)"
              />
              <SpecCard
                icon={<GearboxIcon />}
                label="Käigukast:"
                value="Automaat"
              />
              <SpecCard
                icon={<CalendarIcon />}
                label="Esmaregistreerimine:"
                value="07/2019"
              />
              <SpecCard icon={<FuelIcon />} label="Kütus:" value="Bensiin" />
              <SpecCard icon={<UserIcon />} label="Omanike arv:" value="1" />
            </div>
          </div>
        </div>

        {/* Price section */}
        <div className=" px-5 my-8">
          <PriceSection
            currentPrice={car ? `€ ${(car.discountPrice || car.price).toLocaleString()}` : "€ 0"}
            originalPrice={car && car.discountPrice && Math.round(((car.price - car.discountPrice) / car.price) * 100) > 0 ? `€ ${car.price.toLocaleString()}` : undefined}
            discount={car && car.discountPrice && Math.round(((car.price - car.discountPrice) / car.price) * 100) > 0 ? `-${Math.round(((car.price - car.discountPrice) / car.price) * 100)}%` : undefined}
            taxNote={getVatDisplayText(car)}
          />
        </div>

        {/* Technical data section */}
        <div className="px-5 mb-6">
          <ExpandableSection title="Tehnilised andmed">
            <div className="space-y-3">
              <div className="bg-white rounded-[10px] p-3 flex justify-between">
                <span className="text-[#1A202C] text-sm font-medium">
                  Seisukord:
                </span>
                <span className="text-[#1A202C] text-sm font-normal">
                  Kasutatud, avariivaba
                </span>
              </div>
              <div className="bg-white rounded-[10px] p-3 flex justify-between">
                <span className="text-[#1A202C] text-sm font-medium">
                  Kategooria:
                </span>
                <span className="text-[#1A202C] text-sm font-normal">
                  Sportauto / Kupee
                </span>
              </div>
              <div className="bg-white rounded-[10px] p-3 flex justify-between">
                <span className="text-[#1A202C] text-sm font-medium">
                  Sõiduki number:
                </span>
                <span className="text-[#1A202C] text-sm font-normal">
                  GR01195
                </span>
              </div>
              <div className="bg-white rounded-[10px] p-3 flex justify-between">
                <span className="text-[#1A202C] text-sm font-medium">
                  Läbisõit:
                </span>
                <span className="text-[#1A202C] text-sm font-normal">
                  20 350 km
                </span>
              </div>
              <div className="bg-white rounded-[10px] p-3 flex justify-between">
                <span className="text-[#1A202C] text-sm font-medium">
                  Töömaht:
                </span>
                <span className="text-[#1A202C] text-sm font-normal">
                  5 204 cm³
                </span>
              </div>
              <div className="bg-white rounded-[10px] p-3 flex justify-between">
                <span className="text-[#1A202C] text-sm font-medium">
                  Võimsus:
                </span>
                <span className="text-[#1A202C] text-sm font-normal">
                  533 kW (725 hj)
                </span>
              </div>
              <div className="bg-white rounded-[10px] p-3 flex justify-between">
                <span className="text-[#1A202C] text-sm font-medium">
                  Veoskeem:
                </span>
                <span className="text-[#1A202C] text-sm font-normal">
                  Sisepõlemismootor
                </span>
              </div>
              <div className="bg-white rounded-[10px] p-3 flex justify-between">
                <span className="text-[#1A202C] text-sm font-medium">
                  Kütuse tüüp:
                </span>
                <span className="text-[#1A202C] text-sm font-normal">
                  Bensiin, sobib E10-le
                </span>
              </div>
            </div>
          </ExpandableSection>
        </div>

        {/* High-value features section */}
        <div className="px-5 mb-6">
          <ExpandableSection title="Kõrgema väärtusega lisvarustus">
            <div className="space-y-3">
              <div className="bg-white rounded-[10px] p-3 flex justify-between items-center">
                <span className="text-[#1A202C] text-sm font-medium">ABS</span>
                <Check className="w-5 h-5 text-black" />
              </div>
              <div className="bg-white rounded-[10px] p-3 flex justify-between items-center">
                <span className="text-[#1A202C] text-sm font-medium">
                  Adaptiivne kurvituli
                </span>
                <Check className="w-5 h-5 text-black" />
              </div>
              <div className="bg-white rounded-[10px] p-3 flex justify-between items-center">
                <span className="text-[#1A202C] text-sm font-medium">
                  Häiresüsteem
                </span>
                <Check className="w-5 h-5 text-black" />
              </div>
              <div className="bg-white rounded-[10px] p-3 flex justify-between items-center">
                <span className="text-[#1A202C] text-sm font-medium">
                  Ambiente valgustus
                </span>
                <Check className="w-5 h-5 text-black" />
              </div>
              <div className="bg-white rounded-[10px] p-3 flex justify-between items-center">
                <span className="text-[#1A202C] text-sm font-medium">
                  Apple CarPlay
                </span>
                <Check className="w-5 h-5 text-black" />
              </div>
              <div className="bg-white rounded-[10px] p-3 flex justify-between items-center">
                <span className="text-[#1A202C] text-sm font-medium">
                  Käetugi
                </span>
                <Check className="w-5 h-5 text-black" />
              </div>
            </div>
          </ExpandableSection>
        </div>
        <ImageGallerySection />

        {/* Seller information section */}
        <div className="px-5 mb-6">
          <div className="bg-[#F6F7F9] rounded-[10px] p-5">
            <h2 className="text-[#1A202C] text-lg font-semibold leading-[150%] tracking-[-0.54px] mb-5">
              Müüja andmed
            </h2>

            <div className="flex items-start gap-4">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/6046d70a5fee3409e99c3999eb42f7000a654341?width=160"
                alt="Seller"
                className="w-20 h-20 rounded-[10px] object-cover"
              />
              <div className="flex-1">
                <h3 className="text-[#1A202C] text-base font-medium leading-[150%] tracking-[-0.48px] mb-1">
                  Lorem Ipsum
                </h3>
                <p className="text-[#1A202C] text-base font-normal leading-[150%] tracking-[-0.48px] mb-1">
                  ELKE Mustamäe
                  <br />
                  Tallinn, Mustamäe tee 22
                </p>
                <p className="text-[#1A202C] text-base font-normal leading-[150%] tracking-[-0.48px] mb-1">
                  +372 8888 8888
                </p>
                <p className="text-[#1A202C] text-base font-normal leading-[150%] tracking-[-0.48px]">
                  Näide@elke.ee
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related cars section */}

        <section className="px-5 py-6">
          <h2 className="text-black text-[26px] font-semibold mb-6">
            Vaata viimast autot
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {relatedCars.map((car, index) => (
              <CarCard key={index} {...car} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
