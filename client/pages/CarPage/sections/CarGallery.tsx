import { useState, useEffect, useRef } from 'react';

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

  const allImages = [mainImage, ...thumbnails];
  const currentMainImage = allImages[selectedImage];

  // Filter out empty or null images
  const validImages = allImages.filter(img => img && img.trim() !== '');
  const validThumbnails = thumbnails.filter(img => img && img.trim() !== '');

  // Calculate how many thumbnails to show at once (4 in this case)
  const thumbnailsPerView = 4;
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
      <div className="relative mb-4">
        <img
          src={currentMainImage || validImages[0]}
          alt="Car main view"
          className="w-full h-[650px] object-cover transition-all duration-300 ease-in-out transform rounded-[7.5px]"
        />
      </div>

      {/* Thumbnails - only show if there are valid thumbnails */}
      {validThumbnails.length > 0 && (
        <div className="relative">
          {/* Thumbnails container with overflow hidden */}
          <div className="flex gap-[7px] overflow-hidden">
            {getCurrentThumbnails().map((thumb, index) => (
              <div 
                key={index} 
                className="relative w-[24.4%] flex-shrink-0"
                onClick={() => {
                  handleThumbnailClick(index + 1);
                  // handleThumbnailInteraction();
                }}
              >
                <div
                  className={`w-full h-[94px] rounded-[6.951px] overflow-hidden cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105 ${
                    selectedImage === index + 1
                      ? "border-[3px] border-green-500 shadow-lg rounded-lg py-1 px-2"
                      : "border-[1.697px] border-transparent hover:border-gray-300"
                  }`}
                >
                  <img
                    src={thumb}
                    alt={`Car view ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-200 hover:scale-110 rounded-[6.951px]"
                  />
                </div>
              </div>
            ))}
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
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index 
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
    </div>
  );
}
