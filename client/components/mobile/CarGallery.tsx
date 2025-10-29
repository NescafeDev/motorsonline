import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Lightbox } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { Fullscreen } from "yet-another-react-lightbox/plugins";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import { useI18n } from '@/contexts/I18nContext';

interface CarGalleryProps {
  mainImage: string;
  thumbnails: string[];
  totalImages: number;
  onImageClick?: (index: number) => void;
}

export default function CarGallery({
  mainImage,
  thumbnails,
  totalImages,
  onImageClick,
}: CarGalleryProps) {
  const { t } = useI18n();
  // Filter out empty or null images and ensure no duplicates
  const validMainImage = mainImage && mainImage.trim() !== '' ? mainImage : '/placeholder.svg';
  // Filter out the main image from thumbnails if it exists there to avoid duplicates
  const validThumbnails = thumbnails.filter(img => img && img.trim() !== '' && img !== validMainImage);
  
  // Create a combined array of all images for easier management
  const allImages = [validMainImage, ...validThumbnails];
  const hasImages = allImages.length > 1; // More than just placeholder
  
  // State for current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Lightbox state
  const [isOpen, setIsOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  // Touch/swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const hasSwipedRef = useRef(false);
  
  // Minimum swipe distance (in pixels) to trigger navigation
  const minSwipeDistance = 50;
  
  // Navigation functions
  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };
  
  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };
  
  // Handle image click to update current index
  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    onImageClick?.(index);
  };
  
  // Handle main image click to open lightbox
  const handleMainImageClick = (e?: React.MouseEvent) => {
    // Don't open lightbox if user just swiped
    if (hasSwipedRef.current) {
      hasSwipedRef.current = false;
      e?.preventDefault();
      e?.stopPropagation();
      return;
    }
    setLightboxIndex(currentImageIndex);
    setIsOpen(true);
  };
  
  // Handle keyboard navigation for accessibility
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setLightboxIndex(currentImageIndex);
      setIsOpen(true);
    }
  };
  
  // Touch handlers for swipe detection
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Reset touchEnd
    setTouchStart(e.targetTouches[0].clientX);
    hasSwipedRef.current = false;
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && hasImages && allImages.length > 1) {
      hasSwipedRef.current = true;
      goToNext();
      // Reset the flag after a short delay to allow click handler to check it
      setTimeout(() => {
        hasSwipedRef.current = false;
      }, 300);
    } else if (isRightSwipe && hasImages && allImages.length > 1) {
      hasSwipedRef.current = true;
      goToPrevious();
      // Reset the flag after a short delay to allow click handler to check it
      setTimeout(() => {
        hasSwipedRef.current = false;
      }, 300);
    }
    
    // Reset touch positions
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="px-3">
      {/* Main image */}
      <div 
        className="relative mb-3 aspect-[5/3] w-full touch-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={allImages[currentImageIndex]}
          alt="Car main view"
          className="w-full h-full object-cover rounded-[10px] cursor-pointer hover:opacity-95 transition-opacity select-none"
          onClick={handleMainImageClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label="Open image in lightbox"
          draggable={false}
        />
        
        {/* Lightbox indicator */}
        <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200">
          <Maximize2 className="w-4 h-4" />
        </div>
        
        {/* Navigation arrows - only show if there are multiple images */}
        {hasImages && allImages.length > 1 && (
          <>
            {/* Left arrow */}
            <button
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200 hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            
            {/* Right arrow */}
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200 hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
        
        {/* Image counter badge */}
        {hasImages && (
          <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
            {currentImageIndex + 1} / {allImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails - show all images including main image */}
      {allImages.length > 0 && (
        <div className="flex gap-[7px] overflow-x-auto pb-2 scrollbar-hide">
          {allImages.map((thumb, index) => {
            const isSelected = currentImageIndex === index;
            
            return (
              <div key={index} className="relative flex-shrink-0  w-[calc(33.333%-4.67px)]">
                <div
                  className={`w-full aspect-[5/3] rounded-[6.951px] overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 ${
                    isSelected ? "border-[1.697px] border-primary" : "border border-gray-200 hover:border-primary"
                  }`}
                  onClick={() => handleImageClick(index)}
                >
                  <img
                    src={thumb}
                    alt={`Car view ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                {/* Image number indicator */}
                {/* <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {index + 1}
                </div> */}
              </div>
            );
          })}
        </div>
      )}

      {/* No images message */}
      {!hasImages && (
        <div className="text-center py-8 text-gray-500">
          <p>{t('formLabels.noImagesAvailableForThisCar')}</p>
        </div>
      )}
      
      {/* Lightbox */}
      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={allImages.map((img) => ({ src: img }))}
        plugins={[Fullscreen, Thumbnails]}
        index={lightboxIndex}
        on={{ view: ({ index }) => setLightboxIndex(index) }}
        portal={{ root: typeof document !== 'undefined' ? document.body : undefined }}
        styles={{ container: { zIndex: 2147483647, pointerEvents: 'auto' } }}
        controller={{ closeOnBackdropClick: true, preventDefaultWheelX: true, preventDefaultWheelY: true }}
        thumbnails={{
          position: 'bottom',
          width: 80,
          height: 60,
          border: 1,
          borderRadius: 4,
          padding: 2,
          gap: 4,
          borderColor: 'white',
          imageFit: 'cover',
        }}
      />
    </div>
  );
}
