import { SearchIcon } from "lucide-react";
import { Badge } from "../components/ui/badge";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import PageContainer from "../components/PageContainer";
import axios from "axios";
import { useFavorites } from "../hooks/useFavorites";
import { useAuth } from "../contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import Header from "../components/mobile/Header";
import Footer from "../components/mobile/Footer";
import { CarCard } from "../components/mobile/CarCard";
import { CarListingSection } from "./sections/CarListingSection/CarListingSection";

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
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      
      // First load all cars
      const allCars = await fetchAllApprovedCars();
      setCars(allCars);
      setFilteredCars(allCars);
      setFiltersApplied(false);
      // Parse URL filters
      // const urlFilters: any = {};
      // searchParams.forEach((value, key) => {
      //   if (key.includes('_min') || key.includes('_max')) {
      //     urlFilters[key] = Number(value);
      //   } else if (key.includes('_id') || key === 'seats' || key === 'doors') {
      //     urlFilters[key] = Number(value);
      //   } else if (key === 'with_vat' || key === 'service_book' || key === 'inspection' || 
      //              key === 'accident_free' || key === 'exchange_possible' || key === 'with_warranty') {
      //     urlFilters[key] = value === 'true';
      //   } else if (key.includes('[]')) {
      //     const arrayKey = key.replace('[]', '');
      //     if (!urlFilters[arrayKey]) {
      //       urlFilters[arrayKey] = [];
      //     }
      //     urlFilters[arrayKey].push(value);
      //   } else {
      //     urlFilters[key] = value;
      //   }
      // });
      
      // setFilters(urlFilters);
      
      // // If there are filters, apply them; otherwise show all cars
      // if (Object.keys(urlFilters).length > 0) {
      //   const filtered = await fetchFilteredCars(urlFilters);
      //   setFilteredCars(filtered);
      //   setFiltersApplied(true);
      // } else {
      //   setFilteredCars(allCars);
      //   setFiltersApplied(false);
      // }
    } catch (error) {
      console.error('Failed to load initial data:', error);
      setCars([]);
      setFilteredCars([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!filterOpen) return;
    function handleClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        // Check if the click is on a select dropdown or combobox
        const target = e.target as Element;
        const isSelectContent = target.closest('[data-radix-select-content]') || 
                               target.closest('[data-radix-combobox-content]') ||
                               target.closest('[data-radix-accordion-content]') ||
                               target.closest('[role="combobox"]') ||
                               target.closest('[role="listbox"]');
        
        // Check if the click is on the filter button itself
        const isFilterButton = target.closest('[data-filter-button]');
        
        if (!isSelectContent && !isFilterButton) {
          setFilterOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [filterOpen]);

  useEffect(() => {
    console.log('Initial load cars effect triggered');
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    console.log('Auth state changed, isAuthenticated:', isAuthenticated, 'user:', user);
    loadInitialData();
  }, [isAuthenticated, user, loadInitialData]);

  useEffect(() => {
    const handleCloseFilters = () => {
      setFilterOpen(false);
    };
    
    window.addEventListener('closeFilters', handleCloseFilters);
    return () => window.removeEventListener('closeFilters', handleCloseFilters);
  }, []);
  // Close filter when clicking outside
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
  //       setFilterOpen(false);
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);
  
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
      // If there's a search term, apply search; otherwise show all cars
      if (searchTerm.trim() !== '') {
        handleSearch(searchTerm);
      } else {
        setFilteredCars(cars);
      }
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
      navigate(`/search?${params.toString()}`);
    } else {
      // If no filters, show all cars
      setFilteredCars(cars);
      setFiltersApplied(false);
    }
  };
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFiltersApplied(false);
    
  };

  // Helper function to apply filters to a single car
  // const applyFiltersToCar = (car: Car, filterParams: CarFilters): boolean => {
  //   // This is a simplified filter implementation
  //   // You can expand this based on your specific filter requirements
  //   if (filterParams.brand_id && car.brand_id !== filterParams.brand_id) return false;
  //   if (filterParams.model_id && car.model_id !== filterParams.model_id) return false;
  //   if (filterParams.price_min && car.price < filterParams.price_min) return false;
  //   if (filterParams.price_max && car.price > filterParams.price_max) return false;
  //   if (filterParams.year_min && car.year_value && car.year_value < filterParams.year_min) return false;
  //   if (filterParams.year_max && car.year_value && car.year_value > filterParams.year_max) return false;
    
  //   return true;
  // };

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
    power: car.power || 'N/A',
    ownerCount: car.ownerCount || 'N/A',
    month: car.month || 'N/A',
  });

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden max-w-md">
      <Header />

      <main className="pb-20">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 px-5 py-4">
        </div>

        {/* Search Bar */}
        <section className="">
          <div className="flex items-center gap-2 mb-2 mt-5">
            <div className="bg-white p-3 rounded-md shadow-sm cursor-pointer z-20 w-full text-center" data-filter-button onClick={() => setFilterOpen((v) => !v)}>
              <span className="text-black font-['Poppins',Helvetica] font-medium text-[16px] tracking-[1.2px]">Filtrid</span>
            </div>
          </div>
          {filterOpen && (
            <div
              ref={filterRef}
              className="absolute left-1 right-1 max-w-md bg-white rounded-[10px] shadow-lg z-30 max-h-[80vh]"
            >
            <CarListingSection
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onApplyFilters={handleApplyFilters}
              navigateToSearch={true}
              isMobile={true}
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
                  <div key={car.id}>
                    <CarCard
                      {...displayCar}
                    />
                  </div>
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
