import { Heart, Eye, Menu } from "lucide-react";
import Header from "@/components/mobile/Header";
import Footer from "@/components/mobile/Footer";
import { useNavigate } from 'react-router-dom';
import { UserCarCard } from '../components/mobile/UserCarCard';
import { useState, useEffect } from "react";
import { useI18n } from "@/contexts/I18nContext";
import axios from 'axios';


interface Car {
  id: number;
  brand_name?: string;
  model_name?: string;
  modelDetail?: string;
  year_value?: number;
  price?: number;
  discountPrice?: number;
  description?: string;
  images?: string[];
  vatRefundable?: string;
  vatRate?: string;
  favoriteCount?: number;
  views?: number;
  major?: string;
  technicalData?: string;
}

export default function UserPageMobile() {
  const navigate = useNavigate();
  const { t , currentLanguage } = useI18n();
  const [userCars, setUserCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to get VAT display text
  const getVatDisplayText = (car: Car) => {
    if (!car) return '';
    console.log('Vat Refundable:', car.vatRefundable);
    
    // If there's no VAT rate or it's empty/null, show "Hind ei sisalda käibemaksu"
    if (car.vatRefundable === "no" || car.vatRefundable === 'ei') {
      return t('vatInfo.vat0NoVatAdded');
    }
    
    // If VAT rate is 24, show "Hind sisaldab käibemaksu 24%"
    // if (car.vatRate === '24') {
      return t('vatInfo.priceIncludesVatWithRate') + ' ' + car.vatRate + '%';
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
      navigate(`/${currentLanguage}/login`)
    }
  }

  async function deleteCar(carId: number) {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
      navigate(`/${currentLanguage}/login`);
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
    navigate(`/${currentLanguage}/update/${carId}`);
  };

  return (
    <div className="min-h-screen bg-white w-full">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Page Title */}
        <h1 className="text-[26px] font-semibold leading-[150%] tracking-[-0.78px] text-motorsonline-dark mb-10">
          {t('listing.myListings')}
        </h1>

        {/* Add Listing Button */}
        <button
          onClick={() => navigate(`/${currentLanguage}/adds`)}
          className="flex px-[30px] py-[15px] justify-center items-center gap-[10px] rounded-[10px] bg-[#06D6A0] mb-5"
        >
          <span className="text-white font-['Poppins'] text-[16px] font-normal leading-[150%]">
            + {t('common.addListing')}
          </span>
        </button>

        {/* Car Listings */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <span className="text-[#747474] font-['Poppins'] text-[18px]">
                {t('common.loading')}...
              </span>
            </div>
          ) : userCars.length > 0 ? (
            userCars.map((car, index) => (
              <UserCarCard
                key={car.id || index}
                id={car.id}
                title={`${car.brand_name || 'Unknown'} ${car.model_name || ''} ${car.modelDetail || ''}`}
                breadcrumb={`${car.technicalData}  »  ${car.brand_name || 'Unknown'} ${car.model_name || ''}  »  ${car.year_value || ''}`}
                image={car.images?.[0] || "https://cdn.builder.io/api/v1/image/assets/TEMP/cc7bda4b04e2c28565ece34ac8989e7268a2a60f?width=620"}
                images={car.images}
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
                major={car.major}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <span className="text-[#747474] font-['Poppins'] text-[18px]">
                {t('listing.noListings')}
              </span>
            </div>
          )}
        </div>

        {/* Results Counter */}
        <p className="text-base leading-[150%] tracking-[-0.48px] text-motorsonline-gray mt-10">
          {loading ? t('common.loading') : t('notifications.showing', { current: userCars.length.toString(), total: userCars.length.toString() })}
        </p>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
