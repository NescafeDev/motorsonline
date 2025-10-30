import React, { useState, useRef } from "react";
import { Eye, Heart, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";

interface UserCarCardProps {
  id: number;
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
  major: string;
  onDelete?: () => void;
  onEdit?: () => void;
}

export const UserCarCard: React.FC<UserCarCardProps> = ({
  id,
  title,
  breadcrumb,
  image,
  images,
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
  const { t } = useI18n();
  // Image navigation state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Prepare images array - use images prop if available, otherwise fallback to single image
  const allImages = images && images.length > 0 ? images.filter(img => img && img.trim() !== '') : [image].filter(img => img && img.trim() !== '');
  const currentImage = allImages[currentImageIndex] || image;

  // Swipe/touch state for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50; // Minimum swipe distance in pixels
  // Smooth swipe drag animation
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const ANIMATION_MS = 400;
  const sliderRef = useRef<HTMLDivElement | null>(null);
  
  // Navigation functions
  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };
  
  const handlePreviousImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (allImages.length <= 1 || isAnimating) return;
    const width = sliderRef.current?.clientWidth || 0;
    setIsAnimating(true);
    setDragX(width);
    setTimeout(() => {
      goToPreviousImage();
      setIsAnimating(false);
      setDragX(0);
    }, ANIMATION_MS);
  };
  
  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (allImages.length <= 1 || isAnimating) return;
    const width = sliderRef.current?.clientWidth || 0;
    setIsAnimating(true);
    setDragX(-width);
    setTimeout(() => {
      goToNextImage();
      setIsAnimating(false);
      setDragX(0);
    }, ANIMATION_MS);
  };

  // Touch handlers for swipe detection
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Reset touchEnd
    const x = e.targetTouches[0].clientX;
    setTouchStart(x);
    setDragX(0);
    setIsDragging(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const x = e.targetTouches[0].clientX;
    setTouchEnd(x);
    if (touchStart !== null) {
      setDragX(x - touchStart);
    }
  };

  const onTouchEnd = () => {
    setIsDragging(false);
    if (touchStart === null || touchEnd === null) {
      setDragX(0);
      setTouchStart(null);
      setTouchEnd(null);
      return;
    }
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if ((isLeftSwipe || isRightSwipe) && allImages.length > 1) {
      setIsAnimating(true);
      const width = sliderRef.current?.clientWidth || 0;
      setDragX(isLeftSwipe ? -width : width);
      setTimeout(() => {
        if (isLeftSwipe) {
          goToNextImage();
        } else {
          goToPreviousImage();
        }
        setIsAnimating(false);
        setDragX(0);
      }, ANIMATION_MS);
    } else {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
        setDragX(0);
      }, ANIMATION_MS);
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Adjacent indices for smooth swipe rendering
  const prevIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
  const nextIndex = (currentImageIndex + 1) % allImages.length;

  const handleViewCar = () => {
    navigate(`/${lang || 'ee'}/car/${id}`);
  };
  return (
    <div className="bg-white rounded-[13px] overflow-hidden shadow-sm w-full xl:w-full mx-auto">
      {/* Image Section */}
      <div 
        className="relative mb-5 group aspect-[5/3] overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        ref={sliderRef}
      >
        <div
          className="absolute inset-0 flex"
          style={{
            transform: `translateX(calc(-100% + ${dragX}px))`,
            transition: isAnimating ? `transform ${ANIMATION_MS}ms ease` : undefined,
          }}
        >
          <img
            src={allImages[prevIndex]}
            alt={title}
            className="w-full h-full aspect-[5/3] object-cover select-none"
            draggable={false}
          />
          <img
            src={currentImage}
            alt={title}
            className="w-full h-full aspect-[5/3] object-cover select-none"
            draggable={false}
          />
          <img
            src={allImages[nextIndex]}
            alt={title}
            className="w-full h-full aspect-[5/3] object-cover select-none"
            draggable={false}
          />
        </div>
        
        {/* Navigation arrows - only show if there are multiple images */}
        {allImages.length > 1 && (
          <>
            {/* Previous button */}
            <button
              onClick={handlePreviousImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-70 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>

            {/* Next button */}
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-70 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </>
        )}

        {/* Image counter */}
        {allImages.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {currentImageIndex + 1} / {allImages.length}
          </div>
        )}

        {/* Discount Badge */}
        {discount !== "0%" && discount && (
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
            {major && major.length > 50 ? `${major.substring(0, 50)}...` : major}
          </div>
          <p className="text-sm text-motors-gray leading-[21px] tracking-[-0.42px]">
            {breadcrumb ? breadcrumb.charAt(0).toUpperCase() + breadcrumb.slice(1) : breadcrumb}
          </p>
        </div>
        

        {/* Description */}
        {/* <p className="text-sm text-motors-gray leading-[21px] tracking-[-0.42px] mb-4 line-clamp-2">
          {description}
        </p> */}

        {/* Price Section */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            {discount !== "0%" && originalPrice && (
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
              {t('common.preview')}
          </button>
          {/* Edit and Delete Buttons */}
            <button
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-[10px] border border-[#06D6A0] bg-white text-[#06D6A0] font-medium text-sm hover:bg-[#06D6A0] hover:text-white transition-colors"
            >
              <Edit className="w-4 h-4" />
              {t('common.edit')}
            </button>
            <button
              onClick={onDelete}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-[10px] border border-[#FF0000] bg-white text-[#FF0000] font-medium text-sm hover:bg-[#FF0000] hover:text-white transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              {t('common.delete')}
            </button>
        </div>
      </div>
    </div>
  );
};
