import { Search, SearchIcon } from "lucide-react";
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
import { useI18n } from "@/contexts/I18nContext";

// Banner image interface
interface BannerImage {
  id: number;
  desktop_image: string;
  mobile_image: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

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
  address?: string;
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
  major?: string;
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

const vehicleDetails = (car: Car, t: any) => [
  {
    icon: "/img/car/Car.png",
    value: `${car.mileage.toLocaleString()} km`,
  },
  {
    icon: "/img/car/Speedometer.png",
    value: car.power,
  },
  {
    icon: "/img/car/gear-box-switch.png",
    value: car.transmission,
  },
  {
    icon: "/img/car/calendar.png",
    value: car.year_value?.toString() + " - " + (car.month.length === 1 ? `0${car.month}` : car.month) || "N/A",
  },
  {
    icon: "/img/car/gas_station.png",
    value: car.fuelType,
  },
  {
    icon: "/img/car/user_profile.png",
    value: car.ownerCount,
  },
];

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
    const response = await apiClient.get(`/api/cars/public/filtered`);
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
  const { t , currentLanguage } = useI18n();
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [filters, setFilters] = useState<CarFilters>({});
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState<BannerImage[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersApplied, setFiltersApplied] = useState(false);

  // Fetch banner images
  const fetchBanners = useCallback(async () => {
    try {
      const response = await axios.get("/api/banner-images");
      const activeBanners = response.data.filter((banner: BannerImage) => banner.active);
      setBanners(activeBanners);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  }, []);

  // Auto-rotate banners every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

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
    fetchBanners();
  }, [isAuthenticated, user, loadCars, fetchBanners]);

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

  // Listen for custom close filters event
  useEffect(() => {
    const handleCloseFilters = () => {
      setFilterOpen(false);
    };

    window.addEventListener('closeFilters', handleCloseFilters);
    return () => window.removeEventListener('closeFilters', handleCloseFilters);
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

  // Function to get VAT display text
  const getVatDisplayText = (car: Car) => {
    if (!car) return '';

    // If there's no VAT rate or it's empty/null, show "Hind ei sisalda käibemaksu"
    if (!car.vatRate || car.vatRate === '' || car.vatRate === 'null' || car.vatRefundable === 'ei' || car.vatRefundable === 'no') {
      return t('vatInfo.vat0NoVatAdded');
    }

    // For any other VAT rate, show the specific rate
    return `${t('vatInfo.priceIncludesVat')} ${car.vatRate}%`;
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
    image: car.images?.[0] || "img/Rectangle 34624924.png",
    images: car.images,
    isFavorite: isFavorite(car.id),
    power: car.power || 'N/A',
    ownerCount: car.ownerCount || 'N/A',
    month: car.month || 'N/A',
    major: car.major,
    address: car.address || 'Tuleviku tee 4a Peetri, 75312 Harju maakond',
    businessType: car.businessType || 'N/A',
  });


  // Blog state
  const [blogs, setBlogs] = useState<any[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(true);

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs');
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setBlogsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Convert blogs to BlogCard format
  const blogPosts = blogs.map(blog => ({
    id: blog.id,
    title: blog.title,
    description: blog.introduction?.replace(/<[^>]*>/g, '').substring(0, 100) + '...' || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    category: blog.category,
    image: blog.title_image || 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=390&h=247&fit=crop&crop=center',
  }));

  return (
    <div className="min-h-screen bg-white w-full md:w-1/2">
      <Header />

      {/* Main Content */}
      <main className="bg-[#F6F7F9]">
        {/* Hero Section */}
        <section className="bg-motors-light">
          <div className="h-full flex justify-center p-5 relative">
            {banners.length > 0 && banners[currentBannerIndex] && banners[currentBannerIndex].mobile_image ? (
              <img
                className="h-[100%] mt-5 rounded-xl object-contain"
                style={{ width: '360px', height: '200px' }}
                alt={`Banner ${currentBannerIndex + 1}`}
                src={banners[currentBannerIndex].mobile_image}
              />
            ) : (
              <img
                className="h-[100%] mt-5 rounded-xl object-contain"
                alt="Car hero image"
                src="/img/photo_2025-10-10_22-33-18.jpg"
              />
            )}
            
            {/* Navigation Dots - Only show if more than 1 banner */}
            {banners.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBannerIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentBannerIndex
                        ? "bg-black"
                        : "bg-black/50 hover:bg-black/75"
                    }`}
                    aria-label={`Go to banner ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Car Hero Image */}
        {/* <section className="px-5">
          <div className="w-full h-[374px] bg-gray-200 overflow-hidden">
            <img
              src="/img/mobile/hero.png"
              alt="Hero Car"
              className="w-full h-full object-cover"
            />
          </div>
        </section> */}

        {/* Call to Action Section */}
        <section className="bg-[#F6F7F9] py-5 px-5">
          <div className="bg-white px-3 py-6 rounded-lg">
            <p className="text-motors-dark leading-[150%] tracking-[-0.48px] mb-6 text-center">
              {t('uiActions.sellBuyFree')}
            </p>
            <button className="w-full border text-motors-green py-4 px-6 rounded-[10px] font-normal text-base leading-[150%] border-[#06d6a0] text-[#06d6a0]">
              {t('uiActions.addListingFree')}
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

        <section className="px-5 relative z-40">
          <div className="flex items-center gap-2">
            <div className="bg-white p-3 rounded-md shadow-sm cursor-pointer z-20 w-full text-center flex items-center justify-center" data-filter-button onClick={() => setFilterOpen((v) => !v)}>
              <SearchIcon className="w-4 h-4 mr-1 text-black" />
              <span className="text-black font-['Poppins',Helvetica] font-medium text-[16px] tracking-[0.2px]">{t('search.filters')}</span>
            </div>
          </div>
          {filterOpen && (
            <div
              ref={filterRef}
              className="left-0 mt-2 w-full bg-white rounded-[10px] shadow-lg z-30 overscroll-none"
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

        {/* Car Listings */}
        <section className={`px-3 py-3 ${filterOpen ? "blur-sm transition-all duration-300" : "transition-all duration-300"}`}>
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-500">{t('common.loading')}</div>
            </div>
          )}

          {/* Car Grid */}
          {!loading && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
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

              <div className="pt-6 max-w-md mx-auto">
                <button className="w-full border text-motors-green py-4 px-6 rounded-[10px] font-normal text-base leading-[150%] border-[#06d6a0] text-[#06d6a0]">
                  {t('uiActions.showMoreCars')}
                </button>
              </div>
            </>
          )}
        </section>

        {/* Blog Section */}
        <section className={`px-5 py-12 ${filterOpen ? "blur-sm transition-all duration-300" : "transition-all duration-300"}`}>
          <div className="mb-12 px-6 max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
              {t('footer.blog')}
            </h2>
            <p className="text-motors-dark leading-[150%] tracking-[-0.48px] w-full">
              {t('blog.description')}
            </p>
          </div>

          {blogsLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-lg text-gray-500">{t('common.loading')}</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {blogPosts.map((post) => (
                <BlogCard key={post.id} {...post} />
              ))}
              {blogPosts.length === 0 && !blogsLoading && (
                <div className="col-span-full text-center py-12">
                  <div className="text-lg text-gray-500">{t('uiActions.noBlogPostsFound')}</div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}