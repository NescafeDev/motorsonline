import { HeartIcon, SearchIcon , MapPin} from "lucide-react";
import { Badge } from "../components/ui/badge";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  CarListingSection,
  BlogSection,
  HeroSection,
  FreeListingBanner
} from "./sections";
import PageContainer from "../components/PageContainer";
import axios from "axios";
import { useFavorites } from "../hooks/useFavorites";
import { useAuth } from "../contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/contexts/I18nContext";

// Car-related types
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
  drive_type_ee_name?: string;
  carColorType?: string;
  carColor?: string;
  major?: string;
  address?: string;
}

export interface CarFilters {
  vehicleType?: string;
  brand_id?: number;
  model_id?: number;
  model_name?: string;
  modelDetail?: string;
  trim_level?: string;
  category?: string;
  drive_type_id?: number[];
  seats?: number;
  doors?: number;
  price_min?: number;
  price_max?: number;
  year_min?: number;
  year_max?: number;
  mileage_min?: number;
  mileage_max?: number;
  power_min?: number;
  power_max?: number;
  engine_min?: number;
  engine_max?: number;
  fuel_city_min?: number;
  fuel_city_max?: number;
  fuel_highway_min?: number;
  fuel_highway_max?: number;
  fuel_average_min?: number;
  fuel_average_max?: number;
  co2_min?: number;
  co2_max?: number;
  fuel_type?: string[];
  transmission?: string[];
  color?: string;
  country?: string;
  registered_country?: string;
  imported_from?: string;
  seller_type?: string;
  with_vat?: boolean;
  service_book?: boolean;
  inspection?: boolean;
  accident_free?: boolean;
  exchange_possible?: boolean;
  with_warranty?: boolean;
  equipment?: string[];
  carColorType?: string;
  carColor?: string;
  major?: string;
  address?: string;
}

// Vehicle details data function
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
// API functions
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: "",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function fetchFilteredCars(filters: CarFilters): Promise<Car[]> {
  try {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.append(key, String(value));
        }
      }
    });

    const response = await apiClient.get(`/api/cars/public/filtered?${params}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching filtered cars:', error);
    return [];
  }
}

async function fetchAllApprovedCars(): Promise<Car[]> {
  try {
    const response = await apiClient.get('/api/cars/public/approved');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching all cars:', error);
    return [];
  }
}

async function fetchDriveTypes(): Promise<{ id: number; name: string; ee_name: string }[]> {
  try {
    const response = await apiClient.get('/api/drive-types');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching drive types:', error);
    return [];
  }
}

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t, currentLanguage } = useI18n();
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [filters, setFilters] = useState<CarFilters>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersApplied, setFiltersApplied] = useState(false);
  const getVatDisplayText = (car: Car | null) => {
    if (!car) return '';

    // If there's no VAT rate or it's empty/null, show "Hind ei sisalda käibemaksu"
    if (car.vatRefundable === 'no' || car.vatRefundable === 'ei') {
      return t('vatInfo.vat0NoVatAdded');
    }

    // If VAT rate is 24, show "Hind sisaldab käibemaksu 24%"
    // if (car.vatRate === '24') {
    return t('vatInfo.priceIncludesVat') + ' ' + car.vatRate + '%';
    // }

    // For any other VAT rate, show the specific rate
    // return `Hind sisaldab käibemaksu ${car.vatRate}%`;
  };

  // Calculate discount percentage
  const discountPercentage = (car: Car) => {
    return Math.round(((car.price - car.discountPrice) / car.price) * 100);
  };

  const loadCars = useCallback(async () => {
    console.log('Loading cars...');
    try {
      setLoading(true);
      const allCars = await fetchAllApprovedCars();

      // Check for duplicates and log them
      const uniqueCars = allCars.filter((car, index, self) =>
        index === self.findIndex(c => c.id === car.id)
      );

      if (uniqueCars.length !== allCars.length) {
        console.warn(`Found ${allCars.length - uniqueCars.length} duplicate cars in API response`);
      }

      console.log(`Loaded ${uniqueCars.length} unique cars`);
      setCars(uniqueCars);
      setFilteredCars(uniqueCars);
      setFiltersApplied(false);
    } catch (error) {
      console.error('Failed to load cars:', error);
      // Set empty arrays to prevent undefined errors
      setCars([]);
      setFilteredCars([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial cars and reload when authentication state changes
  useEffect(() => {
    console.log('Loading cars - isAuthenticated:', isAuthenticated, 'user:', user);
    loadCars();
  }, [isAuthenticated, user, loadCars]);

  // Update filtered cars when cars change or search term changes
  useEffect(() => {
    if (filtersApplied) {
      // If filters are applied, use the filtered results
      return;
    }

    // Otherwise, show all cars or search results
    if (searchTerm.trim() === "") {
      setFilteredCars(cars);
    } else {
      const filtered = cars.filter(car =>
        car.brand_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.modelDetail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCars(filtered);
    }
  }, [cars, searchTerm, filtersApplied]);

  const loadFilteredCars = async () => {
    try {
      setLoading(true);
      const filtered = await fetchFilteredCars(filters);
      setFilteredCars(filtered);
      setFiltersApplied(true);
    } catch (error) {
      console.error('Failed to load filtered cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFilteredCarsWithFilters = async (filterParams: CarFilters) => {
    try {
      setLoading(true);
      const filtered = await fetchFilteredCars(filterParams);
      setFilteredCars(filtered);
      setFiltersApplied(true);
    } catch (error) {
      console.error('Failed to load filtered cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: CarFilters) => {
    setFilters(newFilters);
    // If filters are cleared, reset the applied state
    if (Object.keys(newFilters).length === 0) {
      setFiltersApplied(false);
      setFilteredCars(cars);
    } else {
      // Automatically apply filters when they change
      loadFilteredCarsWithFilters(newFilters);
    }
  };


  const handleApplyFilters = () => {
    if (Object.keys(filters).length > 0) {
      // Navigate to search page with filters as URL parameters
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(`${key}[]`, String(v)));
          } else {
            params.append(key, String(value));
          }
        }
      });
      navigate(`/${currentLanguage}/search?${params.toString()}`);
    } else {
      // If no filters, show all cars
      setFilteredCars(cars);
      setFiltersApplied(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFiltersApplied(false); // Reset filter state when searching
  };

  // Format car data for display
  const formatCarForDisplay = (car: Car) => ({
    image: car.images?.[0] || "img/Rectangle 34624924.png",
    title: `${car.brand_name || 'Unknown'} ${car.model_name || ''} ${car.modelDetail || ''}`,
    details: `${car.year_value || 'N/A'}, ${car.mileage?.toLocaleString() || 'N/A'} km`,
    fuel: car.fuelType || 'N/A',
    transmission: car.transmission || 'N/A',
    price: `€ ${car.price?.toLocaleString() || 'N/A'}`,
    isFavorite: false,
    discountPrice: `€ ${car.discountPrice?.toLocaleString() || 'N/A'}`,
    discountPercentage: discountPercentage(car),
    major: car.major || '',
    address: car.address || ''
  });

  return (
    <PageContainer>
      <div className="w-full bg-[#f6f7f9] relative mb-12">
        {/* Hero Section */}
        <HeroSection />

        {/* Free Listing Banner */}
        <FreeListingBanner />

        {/* Main Car Listing Section with Filter */}
        <div className="max-w-[1240px] mx-auto relative mt-10 mb-3">
          <div className="flex">
            <div className="flex w-full">
              <div className="col-3">
                <CarListingSection
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onApplyFilters={handleApplyFilters}
                  navigateToSearch={true}
                />
              </div>
              <div className="col-9 w-full pl-4">
                <div className="mb-8">
                  <div className="mx-auto px-4 w-full bg-white rounded-md p-3 flex items-center">
                    <SearchIcon className="w-4 h-4 mr-2 text-[#747474]" />
                    <Input
                      className="border-none shadow-none focus-visible:ring-0 text-[#747474]"
                      placeholder={t('common.search')}
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                </div>

                {/* Loading State */}
                {loading && (
                  <div className="flex justify-center items-center h-64">
                    <div className="text-lg text-gray-500">{t('common.loading')}</div>
                  </div>
                )}

                {/* Car Grid */}
                {!loading && (
                  <>
                    <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredCars.map((car) => {
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
                            <img
                              className="w-full h-[189px] object-cover"
                              alt="Car"
                              src={displayCar.image}
                            />

                            <CardContent className="p-4 pt-5 pb-2 relative">
                              <div className="grid grid-cols-6">
                                <div className="col-span-5 h-[50px] pt-4">
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
                                        // toggleFavorite(car.id);
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
                              <span className="text-black text-[15px] pl-[5px] tracking-[0.34px] leading-[normal] [font-family:'Poppins',Helvetica] font-medium">
                                {car.major}
                              </span>
                              <div className="grid grid-cols-2 gap-y-2 mb-2">
                                {getVehicleDetails(car, t).map((detail, index) => (
                                  <div key={index} className="flex items-center w-full h-[50px]">
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
                              <div className="flex items-start gap-2 mx-1 my-2 justify-start h-[20px]">
                                <MapPin className="w-5 h-5 text-secondary-500 flex-shrink-0" />
                                <span className="font-medium text-secondary-500 text-xs tracking-[-0.3px] leading-[20px]">
                                  Tuleviku tee 4a Peetri
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>

                    {/* No Results */}
                    {filteredCars.length === 0 && (
                      <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                          <div className="text-lg text-gray-500 mb-2">
                            {cars.length === 0
                              ? t('uiActions.noCarsInDatabase')
                              : t('uiActions.noCarsFoundWithFilters')
                            }
                          </div>
                          {cars.length === 0 && (
                            <div className="text-sm text-gray-400">
                              {t('uiActions.checkDatabaseSetup')}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-center mt-10 mb-10">
                      <Button
                        variant="outline"
                        className="h-11 px-5 py-0 border-[#06d6a0] text-[#06d6a0] rounded-[10px]"
                      >
                        {t('uiActions.showMoreCars')}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <BlogSection />
        {/* Featured Cars Section */}

      </div>
    </PageContainer>
  );
};
