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

  return (
    <div className="px-5">
      {/* Main image */}
      <div className="relative mb-4">
        <img
          src={validMainImage}
          alt="Car main view"
          className="w-full h-[287px] object-cover rounded-[10px] cursor-pointer hover:opacity-95 transition-opacity"
          onClick={() => onImageClick?.(0)}
        />
        {/* Image counter badge */}
        {hasImages && (
          <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
            {allImages.length} {allImages.length === 1 ? 'photo' : 'photos'}
          </div>
        )}
      </div>

      {/* Thumbnails - only show if there are valid thumbnails */}
      {validThumbnails.length > 0 && (
        <div className="flex gap-[7px] overflow-x-auto pb-2">
          {validThumbnails.map((thumb, index) => (
            <div key={index} className="relative flex-shrink-0">
              <div
                className={`w-[126px] h-[105px] rounded-[6.951px] overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 ${
                  index === 0 ? "border-[1.697px] border-primary" : "border border-gray-200 hover:border-primary"
                }`}
                onClick={() => onImageClick?.(index + 1)}
              >
                <img
                  src={thumb}
                  alt={`Car view ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* Image number indicator */}
              <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded-full">
                {index + 2}
              </div>
            </div>
          ))}
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
