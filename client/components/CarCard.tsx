import { Edit , Trash2 } from "lucide-react";
import React from "react";

interface CarCardProps {
  title: string;
  breadcrumb: string;
  image: string;
  description: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  dateEnd: string;
  views: number;
  likes: number;
  vatNote: string;
  className?: string;
  onDelete?: () => void;
  onEdit?: () => void;
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
  description,
  price,
  originalPrice,
  discount,
  dateEnd,
  views,
  likes,
  vatNote,
  className = "",
  onDelete,
  onEdit,
}) => {
  return (
    <div className={`w-100 h-[307px] relative ${className}`}>
      {/* Main Card Background */}
      <div className="w-full h-full bg-[#F6F7F9] rounded-[10px] absolute left-0 top-0"></div>

      {/* Car Image */}
      <img
        src={image}
        alt={title}
        className="w-[310px] h-[227px] rounded-[10px] absolute left-[30px] top-[40px] object-cover"
      />

      {/* Car Title */}
      <h3 className="text-[#1A202C] font-['Poppins'] text-[30px] font-bold leading-[150%] tracking-[-0.9px] absolute left-[370px] top-[40px] w-fit h-[45px]">
        {title}
      </h3>

      {/* Breadcrumb */}
      <div className="flex items-center gap-[9.764px] absolute left-[370px] top-[95px] h-[29px]">
        <span className="text-[#747474] font-['Poppins'] text-[17px] font-normal tracking-[0.342px]">
          {breadcrumb}
        </span>
      </div>

      {/* Price Section */}
      <div className="absolute right-[30px] top-[46px] flex flex-col items-end gap-2">
        {price && (
          <div className="flex items-center gap-[15px]">
            <div className="relative">
              <span className="text-[#747474] font-['Poppins'] text-[18px] font-medium">
                {price}
              </span>
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#747474]"></div>
            </div>
            {discount !== "0%" && (
              <div className="px-[15px] py-[2px] rounded-full border border-[#FF0000] bg-[#FFE5E5]">
                <span className="text-[#FF0000] font-['Poppins'] text-[16px] font-medium">
                  {discount}
                </span>
              </div>
            )}
          </div>
        )}
        <div className="text-[#1A202C] font-['Poppins'] text-[24px] font-bold text-right">
          {originalPrice}
        </div>
        <div className="text-[#747474] font-['Poppins'] text-[12px] font-normal leading-[150%] tracking-[-0.36px] text-right">
          {vatNote}
        </div>
      </div>

      {/* Description */}
      <p className="w-[830px] text-[#1A202C] font-['Poppins'] text-[18px] font-normal leading-[150%] tracking-[-0.54px] absolute left-[370px] top-[156px] h-[54px] overflow-hidden">
        {description}
      </p>

      {/* Bottom Section */}
      <div className="absolute left-[370px] top-[237px] flex items-center gap-[10px]">
        {/* Date */}
        <div className="flex items-center gap-[10px]">
          <CalendarIcon />
          <span className="text-[#1A202C] font-['Poppins'] text-[18px] font-normal leading-[150%] tracking-[-0.54px]">
            {dateEnd}
          </span>
        </div>

        {/* Views */}
        <div className="flex items-center gap-[10px] ml-[50px]">
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

      {/* Action Buttons */}
      <div className="absolute right-[30px] top-[230px] flex items-center gap-[21px]">
        <button 
          onClick={onEdit}
          className="flex h-[45px] px-[20px] py-[12px] justify-center items-center gap-[10px] rounded-[10px] border border-[#06D6A0] text-[#06D6A0]"
        >
          <Edit className="w-4 h-4" />
          <span className="text-[#06D6A0] text-center font-['Poppins'] text-[16px] font-normal leading-[150%]">
          
            Redigeeri
          </span>
        </button>
        <button 
          onClick={onDelete}
          className="flex h-[45px] px-[20px] py-[12px] justify-center items-center gap-[10px] rounded-[10px] border border-[#FF0000]  text-[#FF0000] hover:bg-[#FFE5E5]"
        >
          <Trash2 className="w-4 h-4" />
          <span className="text-[#FF0000] text-center font-['Poppins'] text-[16px] font-normal leading-[150%]">
            Kustuta
          </span>
        </button>
      </div>
    </div>
  );
};
