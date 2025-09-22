import React, { useState, useCallback } from "react";
import { X, Upload, Camera } from "lucide-react";

interface PhotoUploadProps {
  images: (File | null)[];
  onImageChange: (index: number, file: File | null) => void;
  previews?: (string | undefined)[];
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
}

export default function PhotoUpload({ 
  images, 
  onImageChange, 
  previews = [],
  maxFileSize = 5, // 5MB default
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}: PhotoUploadProps) {
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

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

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOver(index);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, index: number) => {
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
        {[...Array(8)].map((_, idx) => {
          const preview = getImagePreview(idx);
          const isDragOver = dragOver === idx;
          
          return (
            <div key={idx} className="flex flex-col items-center">
              <label className="block mb-2 text-center text-sm font-medium text-gray-700">
                {idx === 0 ? '+Lisa foto (põhipilt)' : `Lisa foto ${idx + 1}`}
              </label>
              
              <div 
                className={`relative w-full transition-all duration-200 ${
                  isDragOver ? 'scale-105 ring-2 ring-blue-400' : ''
                }`}
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
                    <div className="relative group">
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
                    </div>
                  ) : (
                    <div className={`
                      flex flex-col items-center justify-center h-32 w-full border-2 border-dashed border-gray-300 rounded-lg 
                      ${isDragOver ? 'border-blue-400 bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'} 
                      transition-all duration-200
                    `}>
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
    </div>
  );
}
