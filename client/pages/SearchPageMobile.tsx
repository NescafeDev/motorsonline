import { SearchIcon } from "lucide-react";
import { Badge } from "../components/ui/badge";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { CarListingSection } from "./sections";
import PageContainer from "../components/PageContainer";
import axios from "axios";
import { useFavorites } from "../hooks/useFavorites";
import { useAuth } from "../contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import Header from "../components/mobile/Header";
import Footer from "../components/mobile/Footer";
import { CarCard } from '@/components/CarCard';

// Car-related types (imported from HomePage)
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
  image_1?: string;
  image_2?: string;
  image_3?: string;
  image_4?: string;
  image_5?: string;
  image_6?: string;
  image_7?: string;
  image_8?: string;
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

export default function SearchPageMobile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [filters, setFilters] = useState<CarFilters>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersApplied, setFiltersApplied] = useState(false);

  const getVatDisplayText = (car: Car) => {
    if (!car) return '';

    if (!car.vatRate || car.vatRate === '' || car.vatRate === 'null' || car.vatRefundable === 'ei' || car.vatRefundable === 'no') {
      return 'KM 0% (käibemaksu ei lisandu)';
    }

    return `Hind sisaldab käibemaksu ${car.vatRate}%`;
  };

  const discountPercentage = (car: Car) => {
    return Math.round(((car.price - car.discountPrice) / car.price) * 100);
  };

  // Load initial cars and apply filters from URL params
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // First load all cars
        const allCars = await fetchAllApprovedCars();
        setCars(allCars);
        
        // Parse URL filters
        const urlFilters: any = {};
        searchParams.forEach((value, key) => {
          if (key.includes('_min') || key.includes('_max')) {
            urlFilters[key] = Number(value);
          } else if (key.includes('_id') || key === 'seats' || key === 'doors') {
            urlFilters[key] = Number(value);
          } else if (key === 'with_vat' || key === 'service_book' || key === 'inspection' || 
                     key === 'accident_free' || key === 'exchange_possible' || key === 'with_warranty') {
            urlFilters[key] = value === 'true';
          } else if (key.includes('[]')) {
            const arrayKey = key.replace('[]', '');
            if (!urlFilters[arrayKey]) {
              urlFilters[arrayKey] = [];
            }
            urlFilters[arrayKey].push(value);
          } else {
            urlFilters[key] = value;
          }
        });
        
        setFilters(urlFilters);
        
        // If there are filters, apply them; otherwise show all cars
        if (Object.keys(urlFilters).length > 0) {
          const filtered = await fetchFilteredCars(urlFilters);
          setFilteredCars(filtered);
          setFiltersApplied(true);
        } else {
          setFilteredCars(allCars);
          setFiltersApplied(false);
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
        setCars([]);
        setFilteredCars([]);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [searchParams]);

  // Close filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(`${key}[]`, String(v)));
        } else {
          params.append(key, String(value));
        }
      }
    });
    navigate(`/search?${params.toString()}`, { replace: true });
  };

  const handleApplyFilters = () => {
    if (Object.keys(filters).length > 0) {
      loadFilteredCarsWithFilters(filters);
    } else {
      setFilteredCars(cars);
      setFiltersApplied(false);
    }
    setFilterOpen(false);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFiltersApplied(false);
  };

  // Format car data for display
  const formatCarForDisplay = (car: Car) => ({
    id: car.id,
    title: `${car.brand_name || 'Unknown'} ${car.model_name || ''}`,
    year: car.year_value || 0,
    mileage: `${car.mileage?.toLocaleString() || 'N/A'} km`,
    price: `€ ${car.price?.toLocaleString() || 'N/A'}`,
    discountPrice: car.discountPrice ? `€ ${car.discountPrice.toLocaleString()}` : `€ ${car.price?.toLocaleString() || 'N/A'}`,
    vatNote: getVatDisplayText(car),
    fuel: car.fuelType || 'N/A',
    transmission: car.transmission || 'N/A',
    image: car.image_1 || "img/Rectangle 34624924.png",
    isFavorite: isFavorite(car.id),
  });

  return (
    <div className="min-h-screen bg-white ">
      <Header />

      <main className="pb-20">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 px-5 py-4">
        </div>

        {/* Search Bar */}
        <section className="px-5">
          <div className="flex items-center gap-2 mb-5 mt-5">
            <div className="bg-white p-3 rounded-md shadow-sm cursor-pointer z-20" onClick={() => setFilterOpen((v) => !v)}>
              <span className="text-black font-medium">Filtrid</span>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm cursor-pointer z-20 w-full">
              {/* <Search className="w-4 h-4 text-black" /> */}
              <input
                type="text"
                placeholder="Otsing"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="text-motors-gray placeholder:text-motors-gray pl-1 outline-none"
              />
            </div>
          </div>
          {filterOpen && (
            <div
              ref={filterRef}
              className="absolute left-0 mt-2 w-3/4 bg-white rounded-[10px] shadow-lg z-30"
            >
            <CarListingSection
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onApplyFilters={handleApplyFilters}
              navigateToSearch={true}
            />
            </div>
          )}
        </section>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-500">Laetakse...</div>
          </div>
        )}

        {/* Car Grid */}
        {!loading && (
          <>
            <div className="px-5 grid grid-cols-1 gap-4">
              {filteredCars.map((car) => {
                const displayCar = formatCarForDisplay(car);
                return (
                  <Card
                    key={car.id}
                    className="rounded-[10px] overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => {
                      navigate(`/car/${car.id}`);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <img
                      className="w-full h-[189px] object-cover"
                      alt="Car"
                      src={displayCar.image}
                    />
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-secondary-500 text-lg tracking-[-0.54px] leading-[27px]">
                            {displayCar.title}
                          </h3>
                          <p className="font-medium text-[#747474] text-sm tracking-[-0.28px] leading-[21px]">
                            {displayCar.year}, {displayCar.mileage}
                          </p>
                        </div>
                        <button
                          className="w-6 h-6 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isAuthenticated) {
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

                      <div className="flex items-center gap-5 mb-4">
                        <div className="flex items-center gap-2">
                          <img
                            className="w-5 h-5"
                            alt="Fuel type"
                            src="/img/vuesax-bold-gas-station.svg"
                          />
                          <span className="text-[#747474] text-sm tracking-[-0.28px] leading-[21px]">
                            {displayCar.fuel}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <img className="w-6 h-6" alt="Transmission" src="/img/car/bevel.svg" />
                          <span className="text-[#747474] text-sm tracking-[-0.28px] leading-[21px]">
                            {displayCar.transmission}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-secondary-500 text-xl">
                            {displayCar.discountPrice}
                          </p>
                          <p className="text-[#747474] text-xs">
                            {displayCar.vatNote}
                          </p>
                        </div>
                        <Button
                          className="h-10 px-[30px] py-3 bg-[#06d6a0] text-white rounded-[10px]"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/car/${car.id}`);
                            window.scrollTo(0, 0);
                          }}
                        >
                          Vaata
                        </Button>
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
                    Autosid ei leitud valitud filtritega
                  </div>
                  <div className="text-sm text-gray-400">
                    Proovige muuta otsingukriteeriume
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center mt-10 mb-10 px-5">
              <Button
                variant="outline"
                className="h-11 px-5 py-0 border-[#06d6a0] text-[#06d6a0] rounded-[10px]"
              >
                Näita rohkem autosid
              </Button>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
