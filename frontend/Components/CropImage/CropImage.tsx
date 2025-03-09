'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop, Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (file: File) => void;
  aspect?: number;
  imageFile?: File | null;
}

export default function ImageCropModal({
  isOpen,
  onClose,
  onSave,
  aspect = 1,
  imageFile
}: ImageCropModalProps) {
  const [crop, setCrop] = useState<Crop>()
  const [imgSrc, setImgSrc] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  const readFile = useCallback((file: File) => {
    
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImgSrc(reader.result?.toString() || '')
    });
    reader.readAsDataURL(file);
  }, []);

  // Effect to load image when file prop changes
  useEffect(() => {
    if (imageFile) {
      readFile(imageFile)
    }
  },[imageFile])

  // Function to handle image load
  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    
    // Initialize crop to center with proper aspect ratio
    setCrop(centerAspectCrop(width, height, aspect));
  }, [aspect]);

  // Function to create cropped image
  const createCroppedImage = async () => {
    if (!imgRef.current || !crop) return null;
    
    setIsLoading(true);
    
    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsLoading(false);
      return null;
    }
    
    const pixelRatio = window.devicePixelRatio;
    
    canvas.width = crop.width * scaleX * pixelRatio;
    canvas.height = crop.height * scaleY * pixelRatio;
    
    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';
    
    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;
    const cropWidth = crop.width * scaleX;
    const cropHeight = crop.height * scaleY;
    
    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );
    
    return new Promise<File>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob || !imageFile) {
          setIsLoading(false);
          return;
        }
        
        const croppedFile = new File([blob], imageFile.name, {
          type: imageFile.type,
          lastModified: Date.now(),
        });
        
        setIsLoading(false);
        resolve(croppedFile);
      }, imageFile?.type);
    })
  }

  const handleSave = async () => {
    try {
      const croppedImage = await createCroppedImage();
      if (croppedImage) {
        onSave(croppedImage);
        handleClose();
      }
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  // Function to handle close
  const handleClose = () => {
    setCrop(undefined);
    setImgSrc('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-auto bg-[#1E1E1E] rounded-lg shadow-lg p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Crop Image</h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-gray-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {imgSrc ? (
          <div className="max-h-[60vh] overflow-auto flex justify-center">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              aspect={aspect}
              className="max-w-full"
            >
              <img
                ref={imgRef}
                src={imgSrc}
                alt="Crop"
                onLoad={onImageLoad}
                className="max-w-full"
              />
            </ReactCrop>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 bg-gray-800 rounded-md text-gray-400">
            <p>No image selected</p>
          </div>
        )}

        <div className="flex justify-end mt-6 gap-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!imgSrc || isLoading}
            className={`px-4 py-2 rounded-md flex items-center gap-2 ${
              !imgSrc || isLoading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-[#00D2D9] text-[#1E1E1E] hover:bg-[#00BDC3]'
            } transition-colors`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}