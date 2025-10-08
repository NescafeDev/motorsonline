import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CarCard } from '@/components/CarCard';

interface Car {
  id: number;
  brand_name?: string;
  model_name?: string;
  modelDetail?: string;
  year_value?: number;
  price?: number;
  discountPrice?: number;
  description?: string;
  image_1?: string;
  vatRefundable?: string;
  vatRate?: string;
  favoriteCount?: number;
  views?: number;
  major?: string;
}

export default function UserForm() {
  const navigate = useNavigate();
  const [userCars, setUserCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to get VAT display text
  const getVatDisplayText = (car: Car) => {
    if (!car) return '';
    console.log('Vat Refundable:', car.vatRefundable);
    
    // If there's no VAT rate or it's empty/null, show "Hind ei sisalda käibemaksu"
    if (car.vatRefundable === "no" || car.vatRefundable === 'ei') {
      return 'KM 0% (käibemaksu ei lisandu)';
    }
    
    // If VAT rate is 24, show "Hind sisaldab käibemaksu 24%"
    // if (car.vatRate === '24') {
      return 'Hind sisaldab käibemaksu ' + car.vatRate + '%';
    // }
    
    // For any other VAT rate, show the specific rate
    // return `Hind sisaldab käibemaksu ${car.vatRate}%`;
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const cars = await fetchCarsByUserID();
        setUserCars(cars);
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  async function fetchCarsByUserID() {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (user && token) {
      try {
        const response = await axios.get(`/api/cars/user/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch favorite counts and view counts for each car
        const carsWithCounts = await Promise.all(
          response.data.map(async (car: Car) => {
            try {
              const [favoriteResponse, viewResponse] = await Promise.all([
                fetch(`/api/favorites/count/${car.id}`),
                fetch(`/api/views/count/${car.id}`)
              ]);
              
              let favoriteCount = 0;
              let viewCount = car.views || 0;
              
              if (favoriteResponse.ok) {
                const favoriteData = await favoriteResponse.json();
                favoriteCount = favoriteData.favoriteCount;
              }
              
              if (viewResponse.ok) {
                const viewData = await viewResponse.json();
                viewCount = viewData.viewCount;
              }
              
              return { ...car, favoriteCount, views: viewCount };
            } catch (error) {
              console.error(`Error fetching counts for car ${car.id}:`, error);
              return { ...car, favoriteCount: 0, views: car.views || 0 };
            }
          })
        );

        return carsWithCounts;
      } catch (error) {
        console.error('Error fetching user cars:', error);
        return [];
      }
    } else {
      navigate('/login')
    }
  }

  async function deleteCar(carId: number) {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
      navigate('/login');
      return;
    }

    // Show confirmation dialog
    const isConfirmed = window.confirm('Kas oled kindel, et soovid selle kuulutuse kustutada?');
    if (!isConfirmed) {
      return;
    }

    try {
      await axios.delete(`/api/cars/${carId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Car deleted successfully:', carId);

      // Refresh the cars list
      const updatedCars = await fetchCarsByUserID();
      setUserCars(updatedCars);

    } catch (err) {
      console.error('Error deleting car:', err);
      alert('Viga kuulutuse kustutamisel. Palun proovi uuesti.');
    }
  }

  const handleDeleteCar = (carId: number) => {
    deleteCar(carId);
  };

  const handleEditCar = (carId: number) => {
    // Navigate to update page with car ID for editing
    navigate(`/update/${carId}`);
  };

  return (
    <div className="w-full bg-white">
      <div className="max-w-[1440px] mx-auto px-[100px] py-[70px]">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-[93px]">
          <h1 className="text-[#1A202C] font-['Poppins'] text-[30px] font-bold leading-[150%] tracking-[-0.9px]">
            Minu kuulutused
          </h1>
          <button
            onClick={() => navigate('/adds')}
            className="flex px-[30px] py-[15px] justify-center items-center gap-[10px] rounded-[10px] bg-[#06D6A0]"
          >
            <span className="text-white font-['Poppins'] text-[16px] font-normal leading-[150%]">
              + Lisa kuulutus
            </span>
          </button>
        </div>

        {/* Car Listings */}
        <div className="flex flex-col gap-[37px]">
          {loading ? (
            <div className="text-center py-8">
              <span className="text-[#747474] font-['Poppins'] text-[18px]">
                Laetakse...
              </span>
            </div>
          ) : userCars.length > 0 ? (
            userCars.map((car, index) => (
              <CarCard
                key={car.id || index}
                title={`${car.brand_name || 'Unknown'} ${car.model_name || ''} ${car.modelDetail || ''}`}
                breadcrumb={`Kasutatud autod  »  ${car.brand_name || 'Unknown'} ${car.model_name || ''}  »  ${car.year_value || ''}`}
                image={car.image_1 || "https://cdn.builder.io/api/v1/image/assets/TEMP/cc7bda4b04e2c28565ece34ac8989e7268a2a60f?width=620"}
                description={car.description || "No description available"}
                price={`€ ${car.price?.toLocaleString() || '0'}`}
                originalPrice={car.discountPrice ? `€ ${car.discountPrice.toLocaleString()}` : undefined}
                discount={car.discountPrice ? `${Math.round(((car.price - car.discountPrice) / car.price) * 100)}%` : undefined}
                dateEnd="Kuni 25. juunini 2025"
                views={car.views || 0}
                likes={car.favoriteCount || 0}
                vatNote={getVatDisplayText(car)}
                onDelete={() => handleDeleteCar(car.id)}
                onEdit={() => handleEditCar(car.id)}
                onPreview={() => navigate(`/car/${car.id}`)}
                major={car.major || ''}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <span className="text-[#747474] font-['Poppins'] text-[18px]">
                Sul pole veel ühtegi kuulutust
              </span>
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div className="mt-[74px]">
          <span className="text-[#747474] font-['Poppins'] text-[18px] font-normal leading-[150%] tracking-[-0.54px]">
            {loading ? 'Laetakse...' : `Kuvatakse ${userCars.length} teavitust ${userCars.length}-st`}
          </span>
        </div>
      </div>
    </div>
  );
}
