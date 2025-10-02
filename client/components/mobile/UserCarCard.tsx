import React from "react";
import { Eye, Heart, Edit, Trash2 } from "lucide-react";

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
  onDelete?: () => void;
  onEdit?: () => void;
}

export const UserCarCard: React.FC<UserCarCardProps> = ({
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
  onDelete,
  onEdit,
}) => {
  return (
    <div className="bg-white rounded-[13px] overflow-hidden shadow-sm w-full max-w-md mx-auto">
      {/* Image Section */}
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-[200px] object-cover"
        />
        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium">
            {discount}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title and Breadcrumb */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-motors-dark mb-1 leading-[27px] tracking-[-0.54px]">
            {title}
          </h3>
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
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-[10px] border border-[#06D6A0] bg-white text-[#06D6A0] font-medium text-sm hover:"
          >
            <Edit className="w-4 h-4" />
            Redigeeri
          </button>
          <button
            onClick={onDelete}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-[10px] border border-[#FF0000] bg-white text-[#FF0000] font-medium text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Kustuta
          </button>
        </div>
      </div>
    </div>
  );
};
