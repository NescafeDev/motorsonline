import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  // Filter out empty or null images
  const validThumbnails = thumbnails.filter(img => img && img.trim() !== '');
  const validMainImage = mainImage && mainImage.trim() !== '' ? mainImage : '/placeholder.svg';
  
  // Create a combined array of all images for easier management
  const allImages = [validMainImage, ...validThumbnails];
  const hasImages = allImages.length > 1; // More than just placeholder
  
  // State for current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
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

  return (
    <div className="px-5">
      {/* Main image */}
      <div className="relative mb-4">
        <img
          src={allImages[currentImageIndex]}
          alt="Car main view"
          className="w-full h-full object-cover rounded-[10px] cursor-pointer hover:opacity-95 transition-opacity"
          onClick={() => handleImageClick(currentImageIndex)}
        />
        
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

      {/* Thumbnails - only show if there are valid thumbnails */}
      {validThumbnails.length > 0 && (
        <div className="flex gap-[7px] overflow-x-auto pb-2">
          {validThumbnails.map((thumb, index) => {
            const actualIndex = index + 1; // +1 because main image is at index 0
            const isSelected = currentImageIndex === actualIndex;
            
            return (
              <div key={index} className="relative flex-shrink-0">
                <div
                  className={`w-[126px] h-full rounded-[6.951px] overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 ${
                    isSelected ? "border-[1.697px] border-primary" : "border border-gray-200 hover:border-primary"
                  }`}
                  onClick={() => handleImageClick(actualIndex)}
                >
                  <img
                    src={thumb}
                    alt={`Car view ${actualIndex + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                {/* Image number indicator */}
                <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {actualIndex + 1}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* No images message */}
      {!hasImages && (
        <div className="text-center py-8 text-gray-500">
          <p>No images available for this car</p>
        </div>
      )}
    </div>
  );
}
