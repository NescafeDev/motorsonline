import { SearchIcon } from "lucide-react";
import { Badge } from "../components/ui/badge";
import React, { useState, useEffect, useCallback } from "react";
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
import { useI18n } from "@/contexts/I18nContext";
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
    views?: number;
    favoriteCount?: number;
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
    views?: number;
    favoriteCount?: number;
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

export default function SearchPage() {
    const navigate = useNavigate();
    const { t , currentLanguage } = useI18n();
    const [searchParams] = useSearchParams();
    const { isAuthenticated, user } = useAuth();
    const { isFavorite, toggleFavorite } = useFavorites();
    const [cars, setCars] = useState<Car[]>([]);
    const [filteredCars, setFilteredCars] = useState<Car[]>([]);
    const [filters, setFilters] = useState<CarFilters>({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filtersApplied, setFiltersApplied] = useState(false);

    const getVatDisplayText = (car: Car | null) => {
        if (!car) return '';

        if (car.vatRefundable === 'no' || car.vatRefundable === 'ei') {
            return t('vatInfo.vat0NoVatAdded');
        }

        return t('vatInfo.priceIncludesVatWithRate') + ' ' + car.vatRate + '%';
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
                        // Handle array parameters
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
        // Update URL with new filters
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
        navigate(`/${currentLanguage}/search?${params.toString()}`, { replace: true });
    };

    const handleApplyFilters = () => {
        if (Object.keys(filters).length > 0) {
            loadFilteredCarsWithFilters(filters);
        } else {
            setFilteredCars(cars);
            setFiltersApplied(false);
        }
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        setFiltersApplied(false);
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
        major: `${car.year_value || 'N/A'}, ${car.mileage?.toLocaleString() || 'N/A'} km`,
    });

    return (
        <PageContainer>
            <div className="w-full bg-[#f6f7f9] relative">
                {/* Header Section */}
                <div className="bg-white border-b border-gray-200">
                    {/* <div className="max-w-[1240px] mx-auto px-6 py-4"> */}
                        {/* <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Otsing</h1>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="border-[#06d6a0] text-[#06d6a0]"
              >
                Tagasi avalehele
              </Button>
            </div> */}
                    {/* </div> */}
                </div>

                {/* Main Search Section */}
                <div className="max-w-[1240px] mx-auto relative mt-6 mb-2">
                    <div className="flex">
                        <div className="flex w-full">
                            <div className="col-3">
                                <CarListingSection
                                    filters={filters}
                                    onFiltersChange={handleFiltersChange}
                                    onApplyFilters={handleApplyFilters}
                                    navigateToSearch={false}
                                />
                            </div>
                            <div className="col-9 w-full pl-4 bg-gray">
                                <div className="mb-3">
                                    <div className="mx-auto px-4 w-full bg-white rounded-md p-3 flex items-center">
                                        <SearchIcon className="w-4 h-4 mr-2 text-[#747474]" />
                                        <Input
                                            className="border-none shadow-none focus-visible:ring-0 text-[#747474]"
                                            placeholder={t('search.placeholder')}
                                            value={searchTerm}
                                            onChange={(e) => handleSearch(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Loading State */}
                                <div className="flex flex-col w-full h-full gap-5">
                                    {loading ? (
                                        <div className="text-center py-8">
                                            <span className="text-[#747474] font-['Poppins'] text-[18px]">
                                            {t('common.loading')}
                                            </span>
                                        </div>
                                    ) : filteredCars.length > 0 ? (
                                        filteredCars.map((car, index) => (
                                            <CarCard
                                                key={car.id || index}
                                                title={`${car.brand_name || 'Unknown'} ${car.model_name || ''} ${car.modelDetail || ''}`}
                                                breadcrumb={`Kasutatud autod  »  ${car.brand_name || 'Unknown'} ${car.model_name || ''}  »  ${car.year_value || ''}`}
                                                image={car.images?.[0] || "https://cdn.builder.io/api/v1/image/assets/TEMP/cc7bda4b04e2c28565ece34ac8989e7268a2a60f?width=620"}
                                                images={car.images}
                                                description={""}
                                                price={`€ ${car.price?.toLocaleString() || '0'}`}
                                                originalPrice={car.discountPrice ? `€ ${car.discountPrice.toLocaleString()}` : undefined}
                                                discount={car.discountPrice ? `${Math.round(((car.price - car.discountPrice) / car.price) * 100)}%` : undefined}
                                                dateEnd=""
                                                views={0}
                                                likes={0}
                                                vatNote={getVatDisplayText(car)}
                                                major={car.major || ''}
                                                hideBottomIcons={true}
                                                power={car.power}
                                                month={car.month}
                                                year={car.year_value}
                                                mileage={car.mileage}
                                                transmission={car.transmission}
                                                fuelType={car.fuelType}
                                                ownerCount={car.ownerCount}
                                                onPreview={() => navigate(`/${currentLanguage}/car/${car.id}`)}
                                                onEdit={() => navigate(`/${currentLanguage}/car/${car.id}/edit`)}
                                                className="bg-white"
                                                address={car.address}
                                            />
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <span className="text-[#747474] font-['Poppins'] text-[18px]">
                                                {/* Sul pole veel ühtegi kuulutust */}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
