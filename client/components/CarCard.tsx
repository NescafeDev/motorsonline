import { Edit, Trash2, Eye, MapPin, ChevronLeft, ChevronRight, ChevronRight as ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { useI18n } from "@/contexts/I18nContext";

interface CarCardProps {
  title: string;
  breadcrumb: string;
  image: string;
  images?: string[];
  description: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  dateEnd: string;
  views: number;
  likes: number;
  vatNote: string;
  className?: string;
  major?: string;
  hideBottomIcons?: boolean;
  power?: string;
  month?: string;
  year?: number;
  mileage?: number;
  transmission?: string;
  fuelType?: string;
  ownerCount?: string;
  address?: string;
  businessType?: string;
  onDelete?: () => void;
  onEdit?: () => void;
  onPreview?: () => void;
}

const CalendarIcon = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 2.5V7.5"
      stroke="#323232"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 2.5V7.5"
      stroke="#323232"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.75 11.25H26.25"
      stroke="#323232"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M23.75 5H6.25C4.86875 5 3.75 6.11875 3.75 7.5V23.75C3.75 25.1313 4.86875 26.25 6.25 26.25H23.75C25.1313 26.25 26.25 25.1313 26.25 23.75V7.5C26.25 6.11875 25.1313 5 23.75 5Z"
      stroke="#323232"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EyeIcon = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.61255 16.3625C9.4538 7.55379 20.545 7.55379 27.3863 16.3625"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.2888 11.6475C21.4855 13.8442 21.4855 17.4058 19.2888 19.6025C17.0921 21.7992 13.5305 21.7992 11.3338 19.6025C9.1371 17.4058 9.1371 13.8442 11.3338 11.6475C13.5305 9.45083 17.0921 9.45083 19.2888 11.6475"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HeartIcon = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.775 26.0125C15.35 26.1625 14.65 26.1625 14.225 26.0125C10.6 24.775 2.5 19.6125 2.5 10.8625C2.5 7 5.6125 3.875 9.45 3.875C11.725 3.875 13.7375 4.975 15 6.675C16.2625 4.975 18.2875 3.875 20.55 3.875C24.3875 3.875 27.5 7 27.5 10.8625C27.5 19.6125 19.4 24.775 15.775 26.0125Z"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.6667 5.41669L7.49999 14.5834L3.33333 10.4167"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CarCard: React.FC<CarCardProps> = ({
  title,
  breadcrumb,
  image,
  images,
  description,
  price,
  originalPrice,
  discount,
  dateEnd,
  views = "",
  likes = "",
  vatNote,
  className = "bg-gray-50",
  major,
  hideBottomIcons = false,
  power,
  month,
  year,
  mileage,
  transmission,
  fuelType,
  ownerCount,
  onDelete,
  onEdit,
  onPreview,
  address,
  businessType
}) => {
  const { t } = useI18n();

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
    <div className={`w-100 h-[307px] relative cursor-pointer`} onClick={onPreview ? onPreview : () => { }}>
      {/* Main Card Background */}
      <div className={`w-full h-full ${className} rounded-[10px] absolute left-0 top-0`}></div>

      {/* Car Image with Navigation */}
      <div className="w-[310px] h-[227px] absolute left-[30px] top-[40px] group">
        <img
          src={currentImage}
          alt={title}
          className="w-full h-full rounded-[10px] object-cover"
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

      {/* Car Title */}
      <h3 className="text-[#1A202C] font-['Poppins'] text-[30px] font-medium leading-[150%] tracking-[-0.9px] absolute left-[370px] top-[30px] w-fit h-[45px]">
        {title}
      </h3>


      {/* Major */}

      <div className="absolute left-[370px] top-[75px] w-fit h-[29px]">
        {major}
      </div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-[9.764px] absolute left-[370px] top-[100px] h-[29px]">
        <span className="text-[#747474] font-['Poppins'] text-[17px] font-normal tracking-[0.342px]">
          {breadcrumb}
        </span>
      </div>


      {/* Price Section */}
      <div className="absolute right-[15px] top-[46px] flex flex-col items-end gap-2">
        {price && (
          <div className="flex items-center gap-[15px]">
            <div className="relative">
              <span className="text-[#747474] font-['Poppins'] text-[18px] font-medium">
                {price}
              </span>
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#747474]"></div>
            </div>
            {!hideBottomIcons && discount !== "0%" && (
              <div className="px-[15px] py-[2px] rounded-full border border-[#FF0000] bg-[#FFE5E5]">
                <span className="text-[#FF0000] font-['Poppins'] text-[16px] font-medium">
                  {discount}
                </span>
              </div>
            )}
          </div>
        )}
        <div className="text-[#1A202C] font-['Poppins'] text-[24px] font-medium text-right">
          {originalPrice}
        </div>
        <div className="text-[#747474] font-['Poppins'] text-[12px] font-normal leading-[150%] tracking-[-0.36px] text-right">
          {vatNote}
        </div>
      </div>

      {/* Description */}
      {/* <p className="w-[830px] text-[#1A202C] font-['Poppins'] text-[18px] font-normal leading-[150%] tracking-[-0.54px] absolute left-[370px] top-[156px] h-[54px] overflow-hidden">
        {description}
      </p> */}

      {/* Car Information Section - Two Lines at Bottom */}
      {hideBottomIcons && (
        <div className="absolute left-[370px] bottom-[70px] grid grid-cols-3 gap-x-[60px] gap-y-[15px]">
          {power && (
            <div className="flex items-center gap-[4px]">
              <img
                className="w-8 h-8"
                src="/img/car/Speedometer.png"
                alt={t('carSpecs.power')}
              />
              <span className="text-[#1A202C] font-['Poppins'] text-[12px] font-medium">{power} kw</span>
            </div>
          )}
          {year && month && (
            <div className="flex items-center gap-[4px]">
              <img
                className="w-8 h-8"
                src="/img/car/calendar.png"
                alt={t('carSpecs.firstRegistration')}
              />
              <span className="text-[#1A202C] font-['Poppins'] text-[12px] font-medium">{year} - {month.length === 1 ? `0${month}` : month}</span>
            </div>
          )}
          {mileage && (
            <div className="flex items-center gap-[4px]">
              <img
                className="w-8 h-8"
                src="/img/car/Car.png"
                alt={t('carSpecs.mileage')}
              />
              <span className="text-[#1A202C] font-['Poppins'] text-[12px] font-medium">{mileage.toLocaleString()} km</span>
            </div>
          )}
          {transmission && (
            <div className="flex items-center gap-[4px]">
              <img
                className="w-8 h-8"
                src="/img/car/gear-box-switch.png"
                alt={t('carSpecs.transmission')}
              />
              <span className="text-[#1A202C] font-['Poppins'] text-[12px] font-medium">{transmission}</span>
            </div>
          )}
          {fuelType && (
            <div className="flex items-center gap-[4px]">
              <img
                className="w-8 h-8"
                src="/img/car/gas_station.png"
                alt={t('carSpecs.fuel')}
              />
              <span className="text-[#1A202C] font-['Poppins'] text-[12px] font-medium">{fuelType}</span>
            </div>
          )}
          {ownerCount && (
            <div className="flex items-center gap-[4px]">
              <img
                className="w-8 h-8"
                src="/img/car/user_profile.png"
                alt="Omanike arv"
              />
              <span className="text-[#1A202C] font-['Poppins'] text-[12px] font-medium">{ownerCount}</span>
            </div>
          )}
        </div>
      )}



      {/* Bottom Section */}
      {!hideBottomIcons && (
        <div className="absolute left-[370px] top-[190px] 2xl:left-[370px] 2xl:top-[237px] flex items-center gap-[10px]">
          {/* Date */}
          <div className="flex items-center gap-[10px]">
            <CalendarIcon />
            <span className="text-[#1A202C] font-['Poppins'] text-[18px] font-normal leading-[150%] tracking-[-0.54px]">
              {dateEnd}
            </span>
          </div>

          {/* Views */}
          <div className="flex items-center gap-[10px] ml-[25px]">
            <EyeIcon />
            <span className="text-[#1A202C] font-['Poppins'] text-[18px] font-normal leading-[150%] tracking-[-0.54px]">
              {views}
            </span>
          </div>

          {/* Likes */}
          <div className="flex items-center gap-[10px] ml-[10px]">
            <HeartIcon />
            <span className="text-[#1A202C] font-['Poppins'] text-[18px] font-normal leading-[150%] tracking-[-0.54px]">
              {likes}
            </span>
          </div>
        </div>
      )}

      {/* Address Section - Always visible */}
      { hideBottomIcons &&  (
        <div className="absolute left-[370px] bottom-0 flex items-center gap-[4px] justify-between w-[500px]">
          <div className="flex items-center gap-[4px]">
            <MapPin className="w-6 h-6" />
            <div className="flex flex-col">
              <div className="font-medium text-secondary-500 text-sm tracking-[-0.3px] leading-[20px]">
                {address}
              </div>
              <div className="font-medium text-secondary-500 text-sm tracking-[-0.3px] leading-[20px]">
                {businessType}
              </div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (address) {
                const encodedAddress = encodeURIComponent(address);
                window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
              }
            }}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors border border-gray-200"
            disabled={!address}
          >
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      )}

      {/* Action Buttons - Only show if any callback is provided */}
      {(onEdit || onDelete || className === "") && !hideBottomIcons && (
        <div className="absolute right-[30px] top-[230px] flex items-center gap-[21px]">
          {onPreview && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPreview();
              }}
              className="flex h-[45px] px-[20px] py-[12px] justify-center items-center gap-[10px] rounded-[10px] border border-[#3B82F6] text-[#3B82F6] hover:bg-[#EBF4FF]"
            >
              <Eye className="w-4 h-4" />
              <span className="text-[#3B82F6] text-center font-['Poppins'] text-[16px] font-normal leading-[150%]">
                {t('common.preview')}
              </span>
            </button>
          )}
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="flex h-[45px] px-[20px] py-[12px] justify-center items-center gap-[10px] rounded-[10px] border border-[#06D6A0] text-[#06D6A0]"
            >
              <Edit className="w-4 h-4" />
              <span className="text-[#06D6A0] text-center font-['Poppins'] text-[16px] font-normal leading-[150%]">
                {t('common.edit')}
              </span>
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="flex h-[45px] px-[20px] py-[12px] justify-center items-center gap-[10px] rounded-[10px] border border-[#FF0000]  text-[#FF0000] hover:bg-[#FFE5E5]"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-[#FF0000] text-center font-['Poppins'] text-[16px] font-normal leading-[150%]">
                {t('common.delete')}
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
