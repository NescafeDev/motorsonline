import { useState, useRef, useEffect } from 'react';
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
  const thumbnailsContainerRef = useRef<HTMLDivElement | null>(null);
  const thumbnailRefs = useRef<Array<HTMLDivElement | null>>([]);
  const mainSliderRef = useRef<HTMLDivElement | null>(null);

  // Drag animation state for smooth swiping
  const [dragX, setDragX] = useState(0); // pixels
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const ANIMATION_MS = 250;

  // Thumbnail slides (3 per slide)
  const THUMBS_PER_SLIDE = 3;
  const totalThumbSlides = Math.ceil(allImages.length / THUMBS_PER_SLIDE);
  const [currentThumbSlide, setCurrentThumbSlide] = useState(0);
  
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

  // Ensure the selected thumbnail is brought into view
  useEffect(() => {
    const el = thumbnailRefs.current[currentImageIndex];
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    } else if (thumbnailsContainerRef.current) {
      // Fallback: approximate scroll by index if element ref missing
      const container = thumbnailsContainerRef.current;
      const thumbWidth = container.firstElementChild instanceof HTMLElement ? container.firstElementChild.offsetWidth + 7 /* gap */ : 0;
      if (thumbWidth > 0) {
        container.scrollTo({ left: thumbWidth * Math.max(0, currentImageIndex - 1), behavior: 'smooth' });
      }
    }
  }, [currentImageIndex]);

  // Keep thumbnail slide in sync with selected image
  useEffect(() => {
    const slideIndex = Math.floor(currentImageIndex / THUMBS_PER_SLIDE);
    if (slideIndex !== currentThumbSlide) {
      setCurrentThumbSlide(slideIndex);
    }
  }, [currentImageIndex]);
  
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
    const x = e.targetTouches[0].clientX;
    setTouchStart(x);
    setDragX(0);
    setIsDragging(true);
    hasSwipedRef.current = false;
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

    if ((isLeftSwipe || isRightSwipe) && hasImages && allImages.length > 1) {
      hasSwipedRef.current = true;
      setIsAnimating(true);
      // Animate to the next or previous slide visually using container width
      const width = mainSliderRef.current?.clientWidth || 0;
      setDragX(isLeftSwipe ? -width : width);
      // After animation, update index and reset to centered position without animation
      setTimeout(() => {
        if (isLeftSwipe) {
          goToNext();
        } else {
          goToPrevious();
        }
        setIsAnimating(false);
        setDragX(0);
        hasSwipedRef.current = false;
      }, ANIMATION_MS);
    } else {
      // Snap back
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
        setDragX(0);
      }, ANIMATION_MS);
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Compute adjacent indices for smooth swipe rendering
  const prevIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
  const nextIndex = (currentImageIndex + 1) % allImages.length;
  return (
    <div className="px-3">
      {/* Main image */}
      <div 
        className="relative mb-3 aspect-[5/3] w-full overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        ref={mainSliderRef}
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
            alt="Previous car view"
            className="w-full h-full object-cover rounded-[10px] select-none"
            draggable={false}
          />
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
          <img
            src={allImages[nextIndex]}
            alt="Next car view"
            className="w-full h-full object-cover rounded-[10px] select-none"
            draggable={false}
          />
        </div>
        
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

      {/* Thumbnails - paginated slides (3 per slide) */}
      {allImages.length > 0 && (
        <div ref={thumbnailsContainerRef} className="flex gap-[7px] pb-2">
          {allImages
            .slice(currentThumbSlide * THUMBS_PER_SLIDE, currentThumbSlide * THUMBS_PER_SLIDE + THUMBS_PER_SLIDE)
            .map((thumb, localIdx) => {
              const globalIndex = currentThumbSlide * THUMBS_PER_SLIDE + localIdx;
              const isSelected = currentImageIndex === globalIndex;
              
              return (
                <div
                  key={globalIndex}
                  ref={(el) => (thumbnailRefs.current[globalIndex] = el)}
                  className="relative flex-shrink-0  w-[calc(33.333%-4.67px)]"
                >
                  <div
                    className={`w-full aspect-[5/3] rounded-[6.951px] overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 ${
                      isSelected ? "border-[1.697px] border-primary" : "border border-gray-200 hover:border-primary"
                    }`}
                    onClick={() => handleImageClick(globalIndex)}
                  >
                    <img
                      src={thumb}
                      alt={`Car view ${globalIndex + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Pagination dots for slides */}
      {totalThumbSlides > 1 && (
        <div className="flex justify-center items-center gap-2 mt-1 mb-1">
          {Array.from({ length: totalThumbSlides }).map((_, slideIdx) => {
            const active = slideIdx === currentThumbSlide;
            return (
              <button
                key={`thumb-slide-dot-${slideIdx}`}
                type="button"
                aria-label={`Go to thumbnails slide ${slideIdx + 1}`}
                aria-current={active ? 'true' : undefined}
                onClick={() => {
                  setCurrentThumbSlide(slideIdx);
                  const firstIndex = slideIdx * THUMBS_PER_SLIDE;
                  setCurrentImageIndex(firstIndex);
                }}
                className={`transition-all duration-200 rounded-full ${
                  active
                    ? 'w-2.5 h-2.5 bg-primary'
                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
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
