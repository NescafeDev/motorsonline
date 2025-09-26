import { HeartIcon } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import axios from "axios";

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
  metallicPaint?: string;
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

export const VehicleDetailsSection = ({ excludeCarId }: VehicleDetailsSectionProps): JSX.Element => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    loadCars();
  }, [loadCars]);

  // Show loading state
  if (loading) {
    return (
      <section className="relative w-full mx-auto py-12 px-4 sm:px-0">
        <h2 className="font-semibold text-[46px] text-black [font-family:'Poppins',Helvetica] mb-12 text-center sm:text-left">
          Vaata viimast autot
        </h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading cars...</div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="relative w-full mx-auto py-12 px-4 sm:px-0">
        <h2 className="font-semibold text-[46px] text-black [font-family:'Poppins',Helvetica] mb-12 text-center sm:text-left">
          Vaata viimast autot
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
      <section className="relative w-full mx-auto py-12 px-4 sm:px-0">
        <h2 className="font-semibold text-[46px] text-black [font-family:'Poppins',Helvetica] mb-12 text-center sm:text-left">
          Vaata viimast autot
        </h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">No cars available</div>
        </div>
      </section>
    );
  }

  // Filter out the excluded car if provided
  const filteredCars = excludeCarId 
    ? cars.filter(car => car.id !== excludeCarId)
    : cars;

  return (
    <section className="max-w-[1400px] relative w-full mx-auto py-12 px-4 sm:px-0">
      <h2 className="font-semibold text-[46px] text-black [font-family:'Poppins',Helvetica] mb-12 text-center sm:text-left">
        Vaata viimast autot
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 sm:px-0">
        {filteredCars.slice(0, 8).map((car, index) => (
          <Card
            key={car.id}
            className="w-full bg-white rounded-[10px] overflow-hidden relative cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/car/${car.id}`)}
          >
            <CardContent className="p-0">
              <img
                className="w-full h-[189px] object-cover"
                alt={`${car.brand_name || 'Unknown'} ${car.model_name || ''}`}
                src={car.image_1 || "/img/Rectangle 34624924.png"}
              />

              <div className="flex flex-col items-start gap-1 p-5 pt-5 relative">
                <div className="flex justify-between items-start w-full">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-secondary-500 text-lg tracking-[-0.54px] leading-[27px] [font-family:'Poppins',Helvetica]">
                      {car.brand_name || 'Unknown'} {car.model_name || ''}
                    </h3>
                    <p className="font-medium text-[#747474] text-sm tracking-[-0.28px] leading-[21px] [font-family:'Poppins',Helvetica]">
                      {car.year_value || 'N/A'}, {car.mileage?.toLocaleString() || 'N/A'} km
                    </p>
                  </div>
                  <button className="flex items-center justify-center">
                    <HeartIcon className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <div className="flex items-center gap-5 mt-4">
                  <div className="flex items-center gap-2">
                    <img
                      className="w-5 h-5"
                      alt="Gas station icon"
                      src="/img/vuesax-bold-gas-station.svg"
                    />
                    <span className="font-normal text-[#747474] text-sm tracking-[-0.28px] leading-[21px] [font-family:'Poppins',Helvetica]">
                      {car.fuelType || 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative w-5 h-5">
                    <img className="w-6 h-6" alt="Google logo" src="/img/car/bevel.svg" />
                    </div>
                    <span className="font-normal text-[#747474] text-sm tracking-[-0.28px] leading-[21px] [font-family:'Poppins',Helvetica]">
                      {car.transmission || 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center w-full mt-4">
                  <p className="font-semibold text-secondary-500 text-xl [font-family:'Poppins',Helvetica]">
                    € {car.price?.toLocaleString() || 'N/A'}
                  </p>
                  <Button 
                    className="h-10 px-[30px] py-3 bg-[#06d6a0] text-primary-0 rounded-[10px] hover:bg-[#05c090]"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/car/${car.id}`);
                    }}
                  >
                    <span className="font-normal text-base text-center text-white tracking-[-0.32px] leading-6 [font-family:'Poppins',Helvetica]">
                      Vaata
                    </span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
