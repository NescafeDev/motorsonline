import { Heart, Fuel, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useFavorites } from "../../hooks/useFavorites";
import { useAuth } from "../../contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

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
  images?: string[];
  isFavorite?: boolean;
  major?: string;
  power?: string;
  ownerCount?: string;
  month?: string;
  address?: string;
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
  images,
  isFavorite = false,
  major,
  power,
  ownerCount,
  month,
  address,
}: CarCardProps) {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const { isAuthenticated } = useAuth();
  const { isFavorite: isFav, toggleFavorite } = useFavorites();
  
  // Image navigation state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Prepare images array - use images prop if available, otherwise fallback to single image
  const allImages = images && images.length > 0 ? images.filter(img => img && img.trim() !== '') : [image].filter(img => img && img.trim() !== '');
  const currentImage = allImages[currentImageIndex] || image;
  
  // Navigation functions
  const handlePreviousImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };
  
  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-white rounded-[13px] overflow-hidden shadow-sm w-full xl:w-full mx-auto"
      onClick={() => {
        navigate(`/${lang || 'ee'}/car/${id}`);
        window.scrollTo(0, 0);
      }}>
      <div className="relative group">
        <img
          src={currentImage}
          alt={title}
          className="w-full h-auto md:h-full object-cover"
        />
        
        {/* Navigation arrows - only show if there are multiple images */}
        {allImages.length > 1 && (
          <>
            {/* Previous button */}
            <button
              onClick={handlePreviousImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-40 hover:bg-opacity-70 rounded-full p-2 shadow-lg transition-all duration-200 hover:shadow-xl z-10 opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>

            {/* Next button */}
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-40 hover:bg-opacity-70 rounded-full p-2 shadow-lg transition-all duration-200 hover:shadow-xl z-10 opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>
          </>
        )}

        {/* Image counter */}
        {allImages.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {currentImageIndex + 1} / {allImages.length}
          </div>
        )}
      </div>

      <div className="p-2 md:p-1">
        <div className="grid grid-cols-5 gap-2 h-20 p-2">
          <div className="col-span-4 flex flex-col justify-center">
            <h3 className="text-xl font-semibold text-motors-dark mb-1 leading-[30px] tracking-[-0.6px] pl-[10px]">
              {title}
            </h3>
            <p className="text-sm text-motors-gray font-medium leading-[21px] tracking-[-0.28px] pl-[10px]">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 px-5">
          {/* Mileage */}
          <div className="flex items-center bg-white rounded-lg p-2">
            <div className="w-8 h-8 relative flex-shrink-0">
              <img
                className="w-7 h-7 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                alt="Mileage"
                src="/img/car/Car.png"
              />
            </div>
            <div className="flex flex-col min-w-0 flex-1 ml-1 justify-center">
              <span className="font-medium text-secondary-500 text-sm tracking-[-0.3px] leading-[20px] break-words">
                {mileage}
              </span>
            </div>
          </div>
          {/* First Registration */}
          <div className="flex items-center bg-white rounded-lg p-2">
            <div className="w-8 h-8 relative flex-shrink-0">
              <img
                className="w-7 h-7 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                alt="First Registration"
                src="/img/car/calendar.png"
              />
            </div>
            <div className="flex flex-col min-w-0 flex-1 ml-1 justify-center">
              <span className="font-medium text-secondary-500 text-sm tracking-[-0.3px] leading-[20px] break-words">
                {year} - {month ? (month.length === 1 ? `0${month}` : month) : 'N/A'}
              </span>
            </div>
          </div>
          {/* Power */}
          <div className="flex items-center bg-white rounded-lg p-2">
            <div className="w-8 h-8 relative flex-shrink-0">
              <img
                className="w-7 h-7 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                alt="Power"
                src="/img/car/Speedometer.png"
              />
            </div>
            <div className="flex flex-col min-w-0 flex-1 ml-1 justify-center">
              <span className="font-medium text-secondary-500 text-sm tracking-[-0.3px] leading-[20px] break-words">
                {power || 'N/A'} kw
              </span>
            </div>
          </div>
          {/* Fuel */}
          <div className="flex items-center bg-white rounded-lg p-2">
            <div className="w-8 h-8 relative flex-shrink-0">
              <img
                className="w-7 h-7 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                alt="Fuel type"
                src="/img/car/gas_station.png"
              />
            </div>
            <div className="flex flex-col min-w-0 flex-1 ml-1 justify-center">
              <span className="font-medium text-secondary-500 text-sm tracking-[-0.3px] leading-[20px] break-words">
                {fuel}
              </span>
            </div>
          </div>

          {/* Transmission */}
          <div className="flex items-center bg-white rounded-lg p-2">
            <div className="w-8 h-8 relative flex-shrink-0">
              <img
                className="w-7 h-7 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                alt="Transmission"
                src="/img/car/gear-box-switch.png"
              />
            </div>
            <div className="flex flex-col min-w-0 flex-1 ml-1 justify-center">
              <span className="font-medium text-secondary-500 text-sm tracking-[-0.3px] leading-[20px] break-words">
                {transmission}
              </span>
            </div>
          </div>

          
          {/* Owner Count */}
          <div className="flex items-center bg-white rounded-lg p-2">
            <div className="w-8 h-8 relative flex-shrink-0">
              <img
                className="w-7 h-7 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                alt="Owner Count"
                src="/img/car/user_profile.png"
              />
            </div>
            <div className="flex flex-col min-w-0 flex-1 ml-1 justify-center">
              <span className="font-medium text-secondary-500 text-sm tracking-[-0.3px] leading-[20px] break-words">
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
        <Separator className="my-3" />
        <div className="flex items-start gap-2 mx-2 my-3 justify-start">
          <MapPin className="w-5 h-5 text-secondary-500 flex-shrink-0" />
          <span className="font-medium text-secondary-500 text-sm tracking-[-0.3px] leading-[20px]">
            {address}
          </span>
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
