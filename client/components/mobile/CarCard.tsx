import { Heart, Fuel } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useFavorites } from "../../hooks/useFavorites";
import { useAuth } from "../../contexts/AuthContext";
import { Separator } from "@/components/ui/separator";

interface CarCardProps {
  id: number;
  title: string;
  year: number;
  mileage: string;
  price: string;
  discountPrice: string;
  vatNote: string;
  fuel: string;
  transmission: string;
  image: string;
  isFavorite?: boolean;
  major?: string;
  power?: string;
  ownerCount?: string;
  month?: string;
}

export function CarCard({
  id,
  title,
  year,
  mileage,
  price,
  discountPrice,
  vatNote,
  fuel,
  transmission,
  image,
  isFavorite = false,
  major,
  power,
  ownerCount,
  month,
}: CarCardProps) {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const { isAuthenticated } = useAuth();
  const { isFavorite: isFav, toggleFavorite } = useFavorites();

  return (
    <div className="bg-white rounded-[13px] overflow-hidden shadow-sm w-full max-w-md mx-auto"
      onClick={() => {
        navigate(`/${lang || 'ee'}/car/${id}`);
        window.scrollTo(0, 0);
      }}>
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-[247px] md:h-full object-cover"
        />
      </div>

      <div className="p-4 md:p-2">
        <div className="grid grid-cols-5 gap-2 h-20 p-2">
          <div className="col-span-4 flex flex-col justify-center">
            <h3 className="text-xl font-semibold text-motors-dark mb-1 leading-[30px] tracking-[-0.6px]">
              {title}
            </h3>
            <p className="text-sm text-motors-gray font-medium leading-[21px] tracking-[-0.28px]">
              {major}
            </p>
          </div>
          <div className="justify-self-end">
            <button
              className="w-6 h-6 cursor-pointer "
              onClick={(e) => {
                e.stopPropagation();
                if (!isAuthenticated) {
                  // You could show a login prompt here
                  alert('Please log in to save favorites');
                  return;
                }
                toggleFavorite(id);
              }}
            >
              <img
                className="w-6 h-6"
                alt="Favorite"
                src={
                  isFav(id)
                    ? "/img/vuesax-bold-heart.svg"
                    : "/img/vuesax-linear-heart.svg"
                }
              />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 p-2">
          {/* Mileage */}
          <div className="flex items-center bg-white rounded-lg p-2">
            <div className="w-8 h-8 relative flex-shrink-0">
              <img
                className="w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                alt="Mileage"
                src="/img/car/Car.png"
              />
            </div>
            <div className="flex flex-col min-w-0 flex-1 ml-2 justify-center">
              <span className="font-medium text-secondary-500 text-xs tracking-[-0.3px] leading-[20px] break-words">
                {mileage}
              </span>
            </div>
          </div>

          {/* Power */}
          <div className="flex items-center bg-white rounded-lg p-2">
            <div className="w-8 h-8 relative flex-shrink-0">
              <img
                className="w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                alt="Power"
                src="/img/car/Speedometer.png"
              />
            </div>
            <div className="flex flex-col min-w-0 flex-1 ml-2 justify-center">
              <span className="font-medium text-secondary-500 text-xs tracking-[-0.3px] leading-[20px] break-words">
                {power || 'N/A'} km
              </span>
            </div>
          </div>

          {/* Transmission */}
          <div className="flex items-center bg-white rounded-lg p-2">
            <div className="w-8 h-8 relative flex-shrink-0">
              <img
                className="w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                alt="Transmission"
                src="/img/car/gear-box-switch.png"
              />
            </div>
            <div className="flex flex-col min-w-0 flex-1 ml-2 justify-center">
              <span className="font-medium text-secondary-500 text-xs tracking-[-0.3px] leading-[20px] break-words">
                {transmission}
              </span>
            </div>
          </div>

          {/* First Registration */}
          <div className="flex items-center bg-white rounded-lg p-2">
            <div className="w-8 h-8 relative flex-shrink-0">
              <img
                className="w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                alt="First Registration"
                src="/img/car/calendar.png"
              />
            </div>
            <div className="flex flex-col min-w-0 flex-1 ml-2 justify-center">
              <span className="font-medium text-secondary-500 text-xs tracking-[-0.3px] leading-[20px] break-words">
                {year} - {month ? (month.length === 1 ? `0${month}` : month) : 'N/A'}
              </span>
            </div>
          </div>

          {/* Fuel */}
          <div className="flex items-center bg-white rounded-lg p-2">
            <div className="w-8 h-8 relative flex-shrink-0">
              <img
                className="w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                alt="Fuel type"
                src="/img/car/gas_station.png"
              />
            </div>
            <div className="flex flex-col min-w-0 flex-1 ml-2 justify-center">
              <span className="font-medium text-secondary-500 text-xs tracking-[-0.3px] leading-[20px] break-words">
                {fuel}
              </span>
            </div>
          </div>

          {/* Owner Count */}
          <div className="flex items-center bg-white rounded-lg p-2">
            <div className="w-8 h-8 relative flex-shrink-0">
              <img
                className="w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                alt="Owner Count"
                src="/img/car/user_profile.png"
              />
            </div>
            <div className="flex flex-col min-w-0 flex-1 ml-2 justify-center">
              <span className="font-medium text-secondary-500 text-xs tracking-[-0.3px] leading-[20px] break-words">
                {ownerCount || 'N/A'}
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 h-2 mx-2 justify-center">
          {discountPrice && (
            <>
              <div className="relative">
                <span className="font-medium text-[#747474] text-[14px] leading-[normal] [font-family:'Poppins',Helvetica]">
                  {price.toLocaleString()}
                </span>
                <Separator className="absolute w-[40px] top-[12px] -left-1 bg-gray-400" />
              </div>

            </>
          )}
        </div>
        <div className="grid grid-cols-2 h-15 mx-2">

          <div className="col-span-1 flex items-center gap-1 mt-5">

            <p className="font-semibold text-secondary-500 text-[24px] leading-[normal] [font-family:'Poppins',Helvetica]">
              {discountPrice}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 h-5 mx-2">
          <p className="text-[#747474] text-xs tracking-[-0.2px] leading-[16px] mt-1 text-start">
            {vatNote}
          </p>
        </div>
        {/* <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-motors-dark mb-1 leading-[30px] tracking-[-0.6px]">
              {title}
            </h3>
            <p className="text-lg text-motors-gray font-medium leading-[27px] tracking-[-0.36px]">
              {year}, {mileage}
            </p>
          </div>
          <button 
            className="ml-4"
            onClick={(e) => {
              e.stopPropagation();
              if (!isAuthenticated) {
                alert('Please log in to save favorites');
                return;
              }
              toggleFavorite(id);
            }}
          >
            <Heart
              className={`w-[30px] h-[30px] ${
                isFav(id) ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
            />
          </button>
        </div> */}

        {/* <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-2.5">
            <Fuel className="w-6 h-6 text-black" />
            <span className="text-motors-gray tracking-[-0.32px]">{fuel}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 relative">
              <div className="w-5 h-5 bg-black rounded-full absolute top-0.5 left-0.5"></div>
              <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"></div>
              <div className="w-3 h-3 bg-black rounded-full absolute top-1.5 left-1.5"></div>
              <div className="w-2 h-2 bg-white rounded-full absolute top-2 left-2"></div>
              <div className="w-0.5 h-1 bg-black absolute bottom-0 left-3"></div>
              <div className="w-1 h-0.5 bg-black absolute right-0 top-3"></div>
              <div className="w-1 h-0.5 bg-black absolute left-0.5 top-3"></div>
            </div>
            <span className="text-motors-gray tracking-[-0.32px]">
              {transmission}
            </span>
          </div>
        </div> */}

        {/* <div className="flex items-center justify-between">
          <span className="text-xl md:text-2xl font-semibold text-motors-dark">
            {price}
          </span>
        </div> */}
      </div>
    </div>
  );
}
