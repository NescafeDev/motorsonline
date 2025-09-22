# Image Upload Guide for Car Creation

This guide explains how to use the enhanced image upload functionality when creating car listings on the MotorsOnline website.

## Features

### Enhanced PhotoUpload Component
- **Drag & Drop Support**: Users can drag images directly onto upload areas
- **File Validation**: Automatic validation of file types and sizes
- **Preview Functionality**: Real-time preview of uploaded images
- **Multiple Image Support**: Up to 8 images per car listing
- **Main Image Selection**: First image automatically becomes the main thumbnail
- **Error Handling**: Clear error messages for invalid files

### Supported File Types
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)

### File Size Limits
- Maximum file size: 5MB per image
- Configurable via `maxFileSize` prop

## How to Use

### 1. Access the Car Creation Form
Navigate to the car creation page (`/adds` or similar route) where you'll find the enhanced photo upload section.

### 2. Upload Images
You have several ways to add images:

#### Option A: Click to Upload
1. Click on any of the 8 upload areas
2. Select an image file from your device
3. The image will be automatically validated and displayed

#### Option B: Drag & Drop
1. Drag an image file from your file explorer
2. Drop it onto any of the upload areas
3. The area will highlight to indicate it's ready to receive the file

### 3. Image Management
- **Main Image**: The first image (index 0) automatically becomes the main thumbnail
- **Remove Images**: Hover over any uploaded image and click the red X button to remove it
- **Replace Images**: Simply upload a new image to replace an existing one

### 4. Form Submission
- Ensure at least one image is uploaded before submitting
- All images are automatically included when the form is submitted
- Images are uploaded to the server and stored in `/public/img/cars/`

## Technical Implementation

### Server-Side
- **Static File Serving**: Added to `server/index.ts` to serve uploaded images
- **Multer Configuration**: Handles multipart/form-data for image uploads
- **File Storage**: Images stored in `public/img/cars/` with unique filenames
- **Database Integration**: Image paths stored in car database records

### Client-Side
- **Enhanced PhotoUpload Component**: Modern UI with drag & drop support
- **Form Integration**: Seamlessly integrated with car creation form
- **State Management**: Proper handling of image files and previews
- **Error Handling**: User-friendly error messages and validation

## File Structure

```
public/
  img/
    cars/          # Uploaded car images
    placeholder.svg # Default placeholder image
```

## API Endpoints

### POST /api/cars
- Accepts multipart/form-data
- Handles up to 8 images (image_1 through image_8)
- Returns created car object with image paths

### Image URLs
- Images are accessible via: `/img/cars/{filename}`
- Example: `/img/cars/1234567890-123456789.jpg`

## Error Handling

### Common Issues
1. **File Type Not Supported**: Only image files are accepted
2. **File Too Large**: Files must be under 5MB
3. **No Images Uploaded**: At least one image is required
4. **Authentication Required**: User must be logged in to create listings

### Error Messages
- Clear, user-friendly error messages displayed above the form
- Automatic error clearing after 5 seconds
- Validation errors prevent form submission

## Customization

### PhotoUpload Component Props
```typescript
interface PhotoUploadProps {
  images: (File | null)[];
  onImageChange: (index: number, file: File | null) => void;
  previews?: (string | undefined)[];
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
}
```

### Modifying File Limits
```typescript
<PhotoUpload 
  images={carImages}
  onImageChange={handleCarImageChange}
  maxFileSize={10} // 10MB limit
  acceptedTypes={['image/jpeg', 'image/png']} // Only JPEG and PNG
/>
```

## Browser Compatibility

- **Modern Browsers**: Full support for drag & drop and File API
- **Mobile Devices**: Touch-friendly interface with file picker
- **Fallbacks**: Graceful degradation for older browsers

## Security Considerations

- **File Type Validation**: Server-side validation of file types
- **File Size Limits**: Prevents large file uploads
- **Authentication**: Only authenticated users can upload images
- **Path Sanitization**: Secure file naming and storage

## Troubleshooting

### Images Not Displaying
1. Check if the server is running
2. Verify static file serving is enabled
3. Check browser console for errors
4. Ensure image paths are correct in database

### Upload Failures
1. Check file size and type
2. Verify user authentication
3. Check server logs for errors
4. Ensure sufficient disk space

### Performance Issues
1. Optimize image sizes before upload
2. Consider implementing image compression
3. Monitor server resources during uploads

## Future Enhancements

- **Image Compression**: Automatic image optimization
- **Thumbnail Generation**: Multiple image sizes for different use cases
- **Cloud Storage**: Integration with cloud storage services
- **Image Editing**: Basic cropping and rotation tools
- **Bulk Upload**: Multiple image selection at once

## Support

For technical support or questions about the image upload functionality, please refer to the development team or create an issue in the project repository.
