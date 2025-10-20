import { HeartIcon, MapPin, ChevronLeft, ChevronRight, ChevronRight as ArrowRight } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/hooks/useFavorites";

// Car interface (matching HomePage structure)
export interface Car {
  id: number;
  brand_id: number;
  model_id: number;
  year_id: number;
  drive_type_id: number;
  approved: boolean;
  category: string;
  transmission: string;
  fuelType: string;
  plateNumber: string;
  month: string;
  mileage: number;
  power: string;
  displacement: string;
  technicalData: string;
  ownerCount: string;
  modelDetail: string;
  price: number;
  discountPrice: number;
  warranty: string;
  vatRefundable: string;
  vatRate: string;
  accident: string;
  vinCode: string;
  description: string;
  equipment: string;
  additionalInfo: string;
  country: string;
  phone: string;
  businessType: string;
  socialNetwork: string;
  email: string;
  images?: string[];
  tech_check?: string;
  accessories?: string;
  seats?: number;
  doors?: number;
  color?: string;
  registeredCountry?: string;
  importedFrom?: string;
  serviceBook?: string;
  inspection?: string;
  metallic_paint?: string;
  exchangePossible?: string;
  fuelCityConsumption?: number;
  fuelHighwayConsumption?: number;
  fuelAverageConsumption?: number;
  co2Emission?: number;
  created_at?: string;
  updated_at?: string;
  brand_name?: string;
  model_name?: string;
  year_value?: number;
  drive_type_name?: string;
  major?: string;
  address?: string;
  user_id?: number;
}

// API functions
const apiClient = axios.create({
  baseURL: "",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function fetchAllApprovedCars(): Promise<Car[]> {
  try {
    const response = await apiClient.get('/api/cars/public/approved');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching all cars:', error);
    return [];
  }
}

interface VehicleDetailsSectionProps {
  excludeCarId?: number;
}

// Helper function to get VAT display text (matching HomePage)
const useVatText = () => {
  const { t  } = useI18n();

  return (car: Car): string => {
    if (car.vatRefundable === 'no' || car.vatRefundable === 'ei') {
      return t('vatInfo.vat0NoVatAdded');
    }
    return t('vatInfo.priceIncludesVatWithRate') + ' ' + car.vatRate + '%';
  };
};
const getVehicleDetails = (car: Car, t: any) => [
  {
    icon: "/img/car/Car.png",
    value: `${car.mileage.toLocaleString()} km`,
  },
  {
    icon: "/img/car/calendar.png",
    value: car.year_value?.toString() + " - " + (car.month.length === 1 ? `0${car.month}` : car.month) || "N/A",
  },
  {
    icon: "/img/car/Speedometer.png",
    value: car.power + " kw",
  },
  {
    icon: "/img/car/gas_station.png",
    value: car.fuelType,
  },
  {
    icon: "/img/car/gear-box-switch.png",
    value: car.transmission,
  },
  {
    icon: "/img/car/user_profile.png",
    value: car.ownerCount,
  },
];

export const VehicleDetailsSection = ({ excludeCarId }: VehicleDetailsSectionProps): JSX.Element => {
  const navigate = useNavigate();
  const { currentLanguage, t } = useI18n();
  const { isAuthenticated, user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const getVatDisplayText = useVatText();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [carImageIndices, setCarImageIndices] = useState<{ [key: number]: number }>({});
  const [carContacts, setCarContacts] = useState<{ [carId: number]: { address?: string, businessType?: string } }>({});


  // Load cars on component mount
  const loadCars = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allCars = await fetchAllApprovedCars();
      setCars(allCars);
    } catch (err) {
      console.error('Failed to load cars:', err);
      setError('Failed to load cars');
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate discount percentage
  const discountPercentage = (car: Car) => {
    return Math.round(((car.price - car.discountPrice) / car.price) * 100);
  };

  // Image navigation functions
  const handlePreviousImage = (carId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const car = cars.find(c => c.id === carId);
    if (!car || !car.images || car.images.length <= 1) return;

    setCarImageIndices(prev => ({
      ...prev,
      [carId]: prev[carId] === 0 ? car.images.length - 1 : (prev[carId] || 0) - 1
    }));
  };

  const handleNextImage = (carId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const car = cars.find(c => c.id === carId);
    if (!car || !car.images || car.images.length <= 1) return;

    setCarImageIndices(prev => ({
      ...prev,
      [carId]: (prev[carId] || 0) === car.images.length - 1 ? 0 : (prev[carId] || 0) + 1
    }));
  };

  // Format car data for display
  const formatCarForDisplay = (car: Car) => {
    const currentImageIndex = carImageIndices[car.id] || 0;
    const allImages = car.images && car.images.length > 0 ? car.images.filter(img => img && img.trim() !== '') : [];
    const currentImage = allImages.length > 0 ? allImages[currentImageIndex] : "img/Rectangle 34624924.png";

    return {
      image: currentImage,
      images: allImages,
      currentImageIndex,
      title: `${car.brand_name || 'Unknown'} ${car.model_name || ''} ${car.modelDetail || ''}`,
      details: `${car.year_value || 'N/A'}, ${car.mileage?.toLocaleString() || 'N/A'} km`,
      fuel: car.fuelType || 'N/A',
      transmission: car.transmission || 'N/A',
      price: `€ ${car.price?.toLocaleString() || 'N/A'}`,
      isFavorite: false,
      discountPrice: `€ ${car.discountPrice?.toLocaleString() || 'N/A'}`,
      discountPercentage: discountPercentage(car),
      major: car.major || '',
      address: carContacts[car.id]?.address || car.address,
      businessType: carContacts[car.id]?.businessType || car.businessType
    };
  };

  const fetchContactForCar = async (carId: number, userId: number) => {
    try {
      const response = await fetch(`/api/contacts/public/${userId}`);
      if (response.ok) {
        const contactData = await response.json();
        setCarContacts(prev => ({
          ...prev,
          [carId]: contactData
        }));
      }
    } catch (error) {
      console.error('Error fetching contact data:', error);
    }
  };

  useEffect(() => {
    loadCars();
  }, [loadCars]);

  useEffect(() => {
    cars.forEach(car => {
      if (car.user_id && !carContacts[car.id]) {
        fetchContactForCar(car.id, car.user_id);
      }
    });
  }, [cars]);

  // Show loading state
  if (loading) {
    return (
      <section className="w-full md:w-full mx-auto my-8 px-3">
        <h2 className="font-semibold text-[46px] text-black [font-family:'Poppins',Helvetica] mb-12 text-center sm:text-left">
          {t('formLabels.seeTheLatestCar')}
        </h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">{t('common.loading')}</div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="w-full md:w-full mx-auto my-8 px-3">
        <h2 className="font-semibold text-[46px] text-black [font-family:'Poppins',Helvetica] mb-12 text-center sm:text-left">
          {t('formLabels.seeTheLatestCar')}
        </h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </section>
    );
  }

  // Show no cars state
  if (cars.length === 0) {
    return (
      <section className="w-full md:w-full mx-auto my-8 px-3">
        <h2 className="font-semibold text-[46px] text-black [font-family:'Poppins',Helvetica] mb-12 text-center sm:text-left">
          {t('formLabels.seeTheLatestCar')}
        </h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">{t('formLabels.noCarsAvailable')}</div>
        </div>
      </section>
    );
  }

  // Filter out the excluded car if provided
  const filteredCars = excludeCarId 
    ? cars.filter(car => car.id !== excludeCarId)
    : cars;

  return (
    <section className="w-full md:w-full mx-auto my-8 px-3">
      <h2 className="font-semibold text-[46px] text-black [font-family:'Poppins',Helvetica] mb-12 text-center sm:text-left">
        {t('formLabels.seeTheLatestCar')}
      </h2>

      <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3">
        {filteredCars.slice(0, 8).map((car) => {
          const displayCar = formatCarForDisplay(car);
          return (
            <Card
              key={car.id}
              className="rounded-[10px] overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => {
                navigate(`/${currentLanguage}/car/${car.id}`);
                window.scrollTo(0, 0);
              }}
            >
              <div className="relative group">
                <img
                  className="w-full h-[189px] object-cover"
                  alt="Car"
                  src={displayCar.image}
                />

                {/* Navigation arrows - only show if there are multiple images */}
                {displayCar.images && displayCar.images.length > 1 && (
                  <>
                    {/* Previous button */}
                    <button
                      onClick={(e) => handlePreviousImage(car.id, e)}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-40 hover:bg-opacity-70 rounded-full p-2 shadow-lg transition-all duration-200 hover:shadow-xl z-10 opacity-0 group-hover:opacity-100"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-700" />
                    </button>

                    {/* Next button */}
                    <button
                      onClick={(e) => handleNextImage(car.id, e)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-40 hover:bg-opacity-70 rounded-full p-2 shadow-lg transition-all duration-200 hover:shadow-xl z-10 opacity-0 group-hover:opacity-100"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-700" />
                    </button>
                  </>
                )}

                {/* Image counter */}
                {displayCar.images && displayCar.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {displayCar.currentImageIndex + 1} / {displayCar.images.length}
                  </div>
                )}
              </div>

              <CardContent className="p-4 pt-5 pb-2 relative">
                <div className="grid grid-cols-6">
                  <div className="col-span-5 h-[50px] flex items-center justify-start">
                    <h1 className="text-[20px] pl-[5px] font-semibold text-secondary-500 tracking-[-1.20px] leading-[25px] [font-family:'Poppins',Helvetica] ">
                      {car.brand_name} {car.model_name} {car.modelDetail}
                    </h1>
                  </div>
                  <div className="col-span-1 justify-end items-end">
                    <div className="absolute right-5 top-8">
                      <button
                        className="w-6 h-6 cursor-pointer "
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isAuthenticated) {
                            // You could show a login prompt here
                            alert('Please log in to save favorites');
                            return;
                          }
                          toggleFavorite(car.id);
                        }}
                      >
                        <img
                          className="w-6 h-6"
                          alt="Favorite"
                          src={
                            isFavorite(car.id)
                              ? "/img/vuesax-bold-heart.svg"
                              : "/img/vuesax-linear-heart.svg"
                          }
                        />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-start text-black text-[15px] pl-[5px] tracking-[0.34px] leading-[normal] [font-family:'Poppins',Helvetica] font-medium h-[50px] break-words">
                  {car.major && car.major.length > 50 ? `${car.major.substring(0, 50)}...` : car.major}
                </div>
                <div className="grid grid-cols-2 gap-y-2 mb-2">
                  {getVehicleDetails(car, t).map((detail, index) => (
                    <div key={index} className="flex items-center w-full h-[40px]">
                      <div className="w-[35px] h-[35px] relative flex-shrink-0">
                        <img
                          className="w-[25px] h-[25px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                          src={detail.icon}
                        />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1 justify-center">
                        <span className="font-normal text-secondary-500 text-[12px] tracking-[-0.42px] leading-[20px] [font-family:'Poppins',Helvetica] break-all">
                        </span>
                        <span className="font-medium text-secondary-500 text-[12px] tracking-[-0.54px] leading-[20px] [font-family:'Poppins',Helvetica] break-all">
                          {detail.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 h-8 pt-2">
                  {car.discountPrice && (
                    <>
                      <div className="relative">
                        <span className="font-medium text-[#747474] text-[14px] leading-[normal] [font-family:'Poppins',Helvetica]">
                          {displayCar.price.toLocaleString()}
                        </span>
                        <Separator className="absolute w-[40px] top-[12px] -left-1 bg-gray-400" />
                        {
                          displayCar.discountPercentage != 0 && (
                            <Badge className="bg-[#ffe5e5] text-[#ff0000] border border-[#ff0000] rounded-[100px] ml-1 mt-1 px-2.5 py-0.4 text-[12px]">
                              {displayCar.discountPercentage}%
                            </Badge>
                          )
                        }
                      </div>

                    </>
                  )}
                </div>
                <div className="grid grid-cols-1 h-15">
                  <div className="flex items-start gap-1">
                    <div className="mb-4">
                      <span className="font-semibold text-secondary-500 text-[24px] leading-[normal] [font-family:'Poppins',Helvetica]">
                        € {car.discountPrice.toLocaleString()}
                      </span>
                      <p className="text-[#747474] text-xs tracking-[-0.2px] leading-[16px] mt-1 text-center">
                        {getVatDisplayText(car)}
                      </p>
                    </div>
                  </div>

                </div>
                <Separator className="my-3" />
                <div className="flex items-center gap-2 mx-1 justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-secondary-500 flex-shrink-0" />
                    <div className="flex flex-col">
                      <div className="font-medium text-secondary-500 text-sm tracking-[-0.3px] leading-[20px]">
                        {displayCar.businessType}
                      </div>
                      <div className="font-medium text-secondary-500 text-sm tracking-[-0.3px] leading-[20px]">
                        {displayCar.address}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (displayCar.address) {
                        const encodedAddress = encodeURIComponent(displayCar.address);
                        window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
                      }
                    }}
                    className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                    disabled={!displayCar.address}
                  >
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
