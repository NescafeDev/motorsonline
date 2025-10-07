import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";

interface CarGalleryProps {
  mainImage: string;
  thumbnails: string[];
  totalImages: number;
}

export default function CarGallery({
  mainImage,
  thumbnails,
  totalImages,
}: CarGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleThumbnailClick = (index: number) => {
    setSelectedImage(index);
  };

  const handlePreviousImage = () => {
    console.log('Previous clicked!');
    setSelectedImage((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    console.log('Next clicked!');
    setSelectedImage((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };
  const [isOpen, setIsOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  console.log('lightboxIndex', lightboxIndex);

  const handleImageClick = () => {
    console.log('Image clicked');
    setLightboxIndex(selectedImage);
    setIsOpen(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setLightboxIndex(selectedImage);
      setIsOpen(true);
    }
  };

  // Build images without duplicates; don't repeat main image in thumbnails
  const validThumbnails = thumbnails.filter(
    (img) => img && img.trim() !== '' && img !== mainImage
  );
  const allImages = [mainImage, ...validThumbnails];
  const currentMainImage = allImages[selectedImage];

  // Filter out empty or null images
  const validImages = allImages.filter(img => img && img.trim() !== '');

  // Calculate how many thumbnails to show at once
  const thumbnailsPerView = Math.min(4, validThumbnails.length || 1);
  const totalSlides = Math.ceil(validThumbnails.length / thumbnailsPerView);


  // Get current set of thumbnails to display
  const getCurrentThumbnails = () => {
    const startIndex = currentSlide * thumbnailsPerView;
    return validThumbnails.slice(startIndex, startIndex + thumbnailsPerView);
  };

  // Handle manual slide navigation
  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  // If no valid images, show placeholder
  if (validImages.length === 0) {
    return (
      <div className="px-5">
        <div className="relative mb-4">
          <img
            src="/img/placeholder.png"
            alt="No image available"
            className="w-full h-[650px] object-cover bg-gray-200"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="px-5">
      {/* Main image */}
      <div className="relative mb-4 group w-full h-[480px] overflow-hidden rounded-[7.5px] flex items-center bg-black">
        <img
          src={currentMainImage || validImages[0]}
          alt="Car main view"
          className="absolute inset-0 max-w-full max-h-full object-contain transition-all duration-300 ease-in-out transform cursor-pointer w-full h-full"
          onClick={handleImageClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label="Open image in lightbox"
        />
        {/* Lightbox indicator */}
        <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Maximize2 className="w-4 h-4" />
        </div>
        {/* Navigation arrows - only show if there are multiple images */}
        {validImages.length > 1 && (
          <>
            {/* Previous button */}
            <button
              onClick={handlePreviousImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-40 hover:bg-opacity-70 rounded-full p-3 shadow-lg transition-all duration-200 hover:shadow-xl z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>

            {/* Next button */}
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-40 hover:bg-opacity-70 rounded-full p-3 shadow-lg transition-all duration-200 hover:shadow-xl z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </>
        )}

        {/* Image counter */}
        {validImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {selectedImage +1 } / {validImages.length }
          </div>
        )}
      </div>

      {/* Thumbnails - only show if there are valid thumbnails */}
      {validThumbnails.length > 0 && (
        <div className="relative">
          {/* Thumbnails container with overflow hidden */}
          <div className="flex gap-[7px] overflow-hidden">
            {getCurrentThumbnails().map((thumb, index) => {
              const actualIndex = currentSlide * thumbnailsPerView + index + 1; // +1 because mainImage is index 0
              return (
                <div
                  key={actualIndex}
                  className="relative w-[24.4%] flex-shrink-0"
                  onClick={() => {
                    handleThumbnailClick(actualIndex);
                    setLightboxIndex(actualIndex);
                    setIsOpen(true);
                  }}
                >
                  <div
                    className={`w-full h-[94px] rounded-[6.951px] overflow-hidden cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105 ${selectedImage === actualIndex
                        ? "border-[3px] border-red-500 shadow-lg rounded-lg"
                        : "border-[1.697px] border-transparent hover:border-gray-300"
                      }`}
                  >
                    <img
                      src={thumb}
                      alt={`Car view ${actualIndex}`}
                      className="w-full h-full object-cover transition-transform duration-200 hover:scale-110 rounded-[6.951px]"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Slide indicators - only show when auto-sliding is active */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-3 gap-2">
              {Array.from({ length: totalSlides }, (_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    goToSlide(index);
                    // handleThumbnailInteraction();
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === index
                      ? 'bg-green-500'
                      : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Navigation arrows - only show when auto-sliding is active */}
          {/* {totalSlides > 1 && (
            <>
              <button
                onClick={() => {
                  setCurrentSlide((prev) => prev === 0 ? totalSlides - 1 : prev - 1);
                  // handleThumbnailInteraction();
                }}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200"
                aria-label="Previous slide"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => {
                  setCurrentSlide((prev) => (prev + 1) % totalSlides);
                  // handleThumbnailInteraction();
                }}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200"
                aria-label="Next slide"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )} */}
        </div>
      )}
      {/* Render Lightbox outside positioned containers to avoid stacking issues */}
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
          width: 120,
          height: 80,
          border: 2,
          borderRadius: 5,
          padding: 1,
          gap: 5,
          borderColor: 'white',
          imageFit: 'cover',
        }}
      />
    </div>
  );
}
