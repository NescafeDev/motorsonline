import React from "react";
import { Eye, Heart, Edit, Trash2, } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface UserCarCardProps {
  id: number;
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
  major: string;
  onDelete?: () => void;
  onEdit?: () => void;
}

export const UserCarCard: React.FC<UserCarCardProps> = ({
  id,
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
  major,
  onDelete,
  onEdit,
}) => {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();

  const handleViewCar = () => {
    navigate(`/${lang || 'ee'}/car/${id}`);
  };
  return (
    <div className="bg-white rounded-[13px] overflow-hidden shadow-sm w-full max-w-md mx-auto">
      {/* Image Section */}
      <div className="relative mb-5">
        <img
          src={image}
          alt={title}
          className="w-full h-[247px] object-cover"
        />

        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium">
            {discount}
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="">
        {/* Title and Breadcrumb */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-motors-dark mb-1 leading-[27px] tracking-[-0.54px]">
            {title}
          </h3>
          <div className="text-sm text-motors-gray leading-[21px] tracking-[-0.42px]">
            {major}
          </div>
          <p className="text-sm text-motors-gray leading-[21px] tracking-[-0.42px]">
            {breadcrumb}
          </p>
        </div>
        

        {/* Description */}
        {/* <p className="text-sm text-motors-gray leading-[21px] tracking-[-0.42px] mb-4 line-clamp-2">
          {description}
        </p> */}

        {/* Price Section */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {originalPrice}
              </span>
            )}
            <span className="text-xl font-semibold text-motors-dark">
              {price}
            </span>
          </div>
          <p className="text-xs text-motors-gray">
            {vatNote}
          </p>
        </div>

        {/* Stats Section */}
        <div className="flex items-center gap-4 mb-4 text-sm text-motors-gray">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{views}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span>{likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs">{dateEnd}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {/* View Car Button - Full Width */}
          <button
            onClick={handleViewCar}
            className="flex-1 flex items-center justify-center gap-0 py-3 px-2 rounded-[10px] border border-[#3B82F6] text-[#3B82F6] hover:bg-[#EBF4FF] font-medium transition-colors"
          >
            <Eye className="w-4 h-4" />
              Eelvaade
          </button>
          {/* Edit and Delete Buttons */}
            <button
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-[10px] border border-[#06D6A0] bg-white text-[#06D6A0] font-medium text-sm hover:bg-[#06D6A0] hover:text-white transition-colors"
            >
              <Edit className="w-4 h-4" />
              Redigeeri
            </button>
            <button
              onClick={onDelete}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-[10px] border border-[#FF0000] bg-white text-[#FF0000] font-medium text-sm hover:bg-[#FF0000] hover:text-white transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Kustuta
            </button>
        </div>
      </div>
    </div>
  );
};
