import { Search } from "lucide-react";
import Header from "@/components/mobile/Header";
import { CarCard } from "@/components/mobile/CarCard";
import { BlogCard } from "@/components/mobile/BlogCard";
import Footer from "@/components/mobile/Footer";
import { useNavigate } from "react-router-dom";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/mobile/ui/drawer";
import { CarListingSection } from "./sections/CarListingSection/CarListingSection";
import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { useFavorites } from "../hooks/useFavorites";
import { useAuth } from "../contexts/AuthContext";

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
  drive_type_ee_name?: string;
  carColorType?: string;
  carColor?: string;
}

export interface CarFilters {
  vehicleType?: string;
  brand_id?: number;
  model_id?: number;
  model_name?: string;
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
  metallic_paint?: boolean;
  exchange_possible?: boolean;
  with_warranty?: boolean;
  equipment?: string[];
  carColorType?: string;
  carColor?: string;
}

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

export default function HomePageMobile() {
  const navigate = useNavigate();
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

  // Load initial cars
  useEffect(() => {
    console.log('Initial load cars effect triggered');
    loadCars();
  }, []);

  // Reload cars when authentication state changes (login/logout)
  useEffect(() => {
    console.log('Auth state changed, isAuthenticated:', isAuthenticated, 'user:', user);
    loadCars();
  }, [isAuthenticated, user]);

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

  // Close filter when clicking outside
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
        
        if (!isSelectContent) {
          setFilterOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [filterOpen]);

  const loadCars = useCallback(async () => {
    console.log('Loading cars');
    try {
      setLoading(true);
      const allCars = await fetchAllApprovedCars();

      setCars(allCars);
      setFilteredCars(allCars);
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
      loadFilteredCarsWithFilters(filters);
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

  // Function to get VAT display text
  const getVatDisplayText = (car: Car) => {
    if (!car) return '';

    // If there's no VAT rate or it's empty/null, show "Hind ei sisalda käibemaksu"
    if (!car.vatRate || car.vatRate === '' || car.vatRate === 'null') {
      return 'Hind ei sisalda käibemaksu';
    }

    // For any other VAT rate, show the specific rate
    return `Hind sisaldab käibemaksu ${car.vatRate}%`;
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


  const blogPosts = [
    {
      id: 1,
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem varius enim in eros.",
      category: "Kategooria",
      image:
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=390&h=247&fit=crop&crop=center",
    },
    {
      id: 2,
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem varius enim in eros.",
      category: "Kategooria",
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=390&h=247&fit=crop&crop=center",
    },
    {
      id: 3,
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem varius enim in eros.",
      category: "Kategooria",
      image:
        "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?w=390&h=247&fit=crop&crop=center",
    },
    {
      id: 4,
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem varius enim in eros.",
      category: "Kategooria",
      image:
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=390&h=247&fit=crop&crop=center",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main Content */}
      <main className="bg-[#F6F7F9]">
        {/* Hero Section */}
        <section className="bg-motors-light px-2 py-10 lg:py-16">
          <div className="text-center mb-12 max-w-4xl mx-auto px-[20px]">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-6 leading-normal px-4">
              MotorsOnline – Leia oma järgmine auto siit!
            </h1>
            <p className="font-normal text-[30px] mb-6 tracking-[-0.12px] italic">Drive your dream!</p>
            <p className="text-motors-dark leading-[150%] tracking-[-0.48px] mb-8 max-w-md mx-auto px-4">
            Motorsonline on sõidukite müügi- ja ostukeskkond, kus põhirõhk on lihtsusel ja selgusel. Motorsonlines on sõiduki müümine või ostmine mugav, sest kogu tähelepanu on suunatud ainult vajalikule. See on koht, kus tehingud saavad toimuda kiirelt ja arusaadavalt
            </p>
            <button 
              onClick={() => navigate("/register")}
              className="px-[30px] py-[15px] bg-[#06d6a0] rounded-[10px] text-white"
            >
            Registreeru
            </button>
          </div>
        </section>

        {/* Car Hero Image */}
        <section className="px-5">
          <div className="w-full h-[374px] bg-gray-200 overflow-hidden">
            <img
              src="/img/mobile/hero.png"
              alt="Hero Car"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-[#F6F7F9] py-5 px-5">
          <div className="bg-white px-3 py-6 rounded-lg max-w-md">
            <p className="text-motors-dark leading-[150%] tracking-[-0.48px] mb-6">
              Kuulutuste avaldamine on tasuta. Kasutage võimalust, et leida oma
              sõidukile uus omanik!
            </p>
            <button className="w-full border text-motors-green py-4 px-6 rounded-[10px] font-normal text-base leading-[150%] border-[#06d6a0] text-[#06d6a0]">
              Lisa kuulutus tasuta
            </button>
          </div>
        </section>

        {/* Search Section */}
        {/* <section className="max-w-7xl mx-auto">
          <div className="flex items-center">
            <div className="bg-white p-3 rounded-md shadow-sm cursor-pointer z-20" onClick={() => setFilterOpen((v) => !v)}>
              <span className="text-black font-medium">Filtrid</span>
            </div>
            <div className="flex-1 w-full pl-[10px]">
              <div className="bg-white border rounded-md px-3 py-3 flex items-center shadow-sm w-full">
                <Search className="w-4 h-4 text-black" />
                <input
                  type="text"
                  placeholder="Otsing"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="flex-1 text-motors-gray placeholder:text-motors-gray pl-1 outline-none"
                />
              </div>
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
                onApplyFilters={() => {}}
              />
            </div>
          )}
        </section> */}

        <section className="px-5">
          <div className="flex items-center gap-2">
            <div className="bg-white p-3 rounded-md shadow-sm cursor-pointer z-20" onClick={() => setFilterOpen((v) => !v)}>
              <span className="text-black font-medium">Filtrid</span>
            </div>
            <div className="flex-1 items-center py-3 w-full pl-[10px] bg-white border rounded-md ">
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
              />
            </div>
          )}
        </section>

        {/* Car Listings */}
        <section className="px-6 py-6">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-500">Laetakse...</div>
            </div>
          )}

          {/* Car Grid */}
          {!loading && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {filteredCars.map((car) => {
                  const displayCar = formatCarForDisplay(car);
                  return (
                    <div className={filterOpen ? "blur-sm transition-all duration-300" : "transition-all duration-300"} key={car.id}>
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
                      {cars.length === 0
                        ? "Andmebaasis pole autosid"
                        : "Autosid ei leitud valitud filtritega"
                      }
                    </div>
                    {cars.length === 0 && (
                      <div className="text-sm text-gray-400">
                        Kontrollige, kas andmebaas on seadistatud ja migratsioon on käivitatud
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-6 max-w-md mx-auto">
                <button className="w-full border text-motors-green py-4 px-6 rounded-[10px] font-normal text-base leading-[150%] border-[#06d6a0] text-[#06d6a0]">
                  Näita rohkem autosid
                </button>
              </div>
            </>
          )}
        </section>

        {/* Blog Section */}
        <section className="px-5 py-12">
          <div className="mb-12 px-6 max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
              Blog
            </h2>
            <p className="text-motors-dark leading-[150%] tracking-[-0.48px] max-w-md">
              Lorem ipsum dolor sit amet consectetur. Quisque erat imperdiet
              egestas pretium. Nibh convallis id nulla non diam.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {blogPosts.map((post) => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}