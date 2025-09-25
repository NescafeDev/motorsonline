import React, { useState, useCallback } from "react";
import { X, Upload, Camera, GripVertical } from "lucide-react";

interface PhotoUploadProps {
  images: (File | null)[];
  onImageChange: (index: number, file: File | null) => void;
  onReorder?: (sourceIndex: number, destinationIndex: number) => void;
  previews?: (string | undefined)[];
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  maxPhotos?: number;
  initialVisibleCount?: number;
  showMore?: boolean;
  onToggleShowMore?: () => void;
}

export default function PhotoUpload({ 
  images, 
  onImageChange, 
  onReorder,
  previews = [],
  maxFileSize = 5, // 5MB default
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  maxPhotos = 38,
  initialVisibleCount = 8,
  showMore = false,
  onToggleShowMore
}: PhotoUploadProps) {
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported. Please use: ${acceptedTypes.join(', ')}`;
    }
    
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`;
    }
    
    return null;
  }, [acceptedTypes, maxFileSize]);

  const handleFileSelect = useCallback((index: number, file: File | null) => {
    if (file) {
      const error = validateFile(file);
      if (error) {
        setErrors(prev => [...prev, error]);
        setTimeout(() => setErrors(prev => prev.filter(e => e !== error)), 5000);
        return;
      }
    }
    
    onImageChange(index, file);
    setErrors([]);
  }, [onImageChange, validateFile]);

  const handleFileDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOver(index);
  }, []);

  const handleFileDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
  }, []);

  const handleFileDrop = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOver(null);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(index, files[0]);
    }
  }, [handleFileSelect]);

  const removeImage = useCallback((index: number) => {
    onImageChange(index, null);
  }, [onImageChange]);

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index.toString());
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(index);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOver(null);
    
    const sourceIndex = parseInt(e.dataTransfer.getData('text/html'));
    
    if (sourceIndex !== index && onReorder) {
      onReorder(sourceIndex, index);
    }
    
    setDraggedIndex(null);
  }, [onReorder]);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOver(null);
  }, []);

  const getImagePreview = (index: number) => {
    if (images[index]) {
      return URL.createObjectURL(images[index] as File);
    }
    if (previews[index]) {
      return previews[index];
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Error messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          {errors.map((error, idx) => (
            <p key={idx} className="text-red-600 text-sm">{error}</p>
          ))}
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
        {[...Array(showMore ? maxPhotos : initialVisibleCount)].map((_, idx) => {
          const preview = getImagePreview(idx);
          const isDragOver = dragOver === idx;
          const isDragging = draggedIndex === idx;
          
          return (
            <div key={idx} className="flex flex-col items-center">
              <label className="block mb-2 text-center text-sm font-medium text-gray-700">
                {idx === 0 ? '+Lisa foto (põhipilt)' : `Lisa foto ${idx + 1}`}
              </label>
              
              <div 
                className={`relative w-full transition-all duration-200 ${
                  isDragOver ? 'scale-105 ring-2 ring-blue-400' : ''
                } ${isDragging ? 'rotate-2 scale-105 opacity-50' : ''}`}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, idx)}
              >
                <input
                  type="file"
                  accept={acceptedTypes.join(',')}
                  onChange={e => handleFileSelect(idx, e.target.files?.[0] || null)}
                  className="hidden"
                  id={`image-upload-${idx}`}
                />
                
                <label 
                  htmlFor={`image-upload-${idx}`}
                  className={`block w-full cursor-pointer transition-all duration-200 ${
                    preview ? '' : 'hover:bg-gray-50'
                  }`}
                >
                  {preview ? (
                    <div 
                      className="relative group"
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragEnd={handleDragEnd}
                    >
                      <img
                        src={preview}
                        alt={`Pilt ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-400 transition-colors"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeImage(idx);
                          }}
                          className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all duration-200"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      {/* Drag handle for uploaded images */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white bg-opacity-80 rounded-full p-1 cursor-grab active:cursor-grabbing transition-all duration-200">
                        <GripVertical size={16} className="text-gray-600" />
                      </div>
                    </div>
                  ) : (
                    <div 
                      className={`
                        flex flex-col items-center justify-center h-32 w-full border-2 border-dashed border-gray-300 rounded-lg 
                        ${isDragOver ? 'border-blue-400 bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'} 
                        transition-all duration-200
                      `}
                      onDragOver={(e) => handleFileDragOver(e, idx)}
                      onDragLeave={handleFileDragLeave}
                      onDrop={(e) => handleFileDrop(e, idx)}
                    >
                      {isDragOver ? (
                        <Upload size={24} className="text-blue-500 mb-2" />
                      ) : (
                        <Camera size={24} className="text-gray-400 mb-2" />
                      )}
                      <p className="text-xs text-gray-500 text-center">
                        {isDragOver ? 'Drop image here' : 'Click or drag to upload'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Max {maxFileSize}MB
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Show more/less button */}
      {maxPhotos > initialVisibleCount && onToggleShowMore && (
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={onToggleShowMore}
            className="flex items-center gap-2 px-6 py-3 border border-motorsoline-primary text-motorsoline-primary rounded-lg hover:bg-motorsoline-primary hover:text-white transition-colors"
          >
            <span>{showMore ? 'Näita vähem' : `Näita rohkem (${maxPhotos - initialVisibleCount} veel)`}</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 17 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-transform ${showMore ? 'rotate-180' : ''}`}
            >
              <path
                d="M8.5002 11.6997C8.03353 11.6997 7.56686 11.5197 7.21353 11.1664L2.86686 6.81968C2.67353 6.62635 2.67353 6.30635 2.86686 6.11302C3.0602 5.91968 3.3802 5.91968 3.57353 6.11302L7.9202 10.4597C8.2402 10.7797 8.7602 10.7797 9.0802 10.4597L13.4269 6.11302C13.6202 5.91968 13.9402 5.91968 14.1335 6.11302C14.3269 6.30635 14.3269 6.62635 14.1335 6.81968L9.78686 11.1664C9.43353 11.5197 8.96686 11.6997 8.5002 11.6997Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
