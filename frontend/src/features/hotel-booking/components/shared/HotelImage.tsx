// frontend/src/features/hotel-booking/components/shared/HotelImage.tsx
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Loader2, ImageIcon } from 'lucide-react';

interface HotelImageProps {
  imagePath: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  fallbackUrl?: string;
  priority?: boolean;
}

export default function HotelImage({
  imagePath,
  alt,
  width,
  height,
  className = '',
  fill = false,
  fallbackUrl,
  priority = false
}: HotelImageProps) {
  const [imageSignedUrl, setImageSignedUrl] = useState<string>('');
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    const fetchImageSignedUrl = async () => {
      if (!imagePath) {
        console.log('📸 Image path is already a URL:', imagePath);
        setImageSignedUrl('');
        setImageLoading(false);
        return;
      }

      console.log('📸 Fetching signed URL for hotel image path:', imagePath);
      setImageLoading(true);
      setImageError(false);

      try {
        // For now, use direct path or fallback
        setImageSignedUrl(imagePath);
        console.log('✅ Got signed URL for hotel image:', imagePath);
      } catch (error) {
        console.error('❌ Failed to get signed URL for hotel image:', error);
        console.log('📸 Using fallback image due to signed URL error');
        setImageError(true);
      } finally {
        setImageLoading(false);
      }
    };

    fetchImageSignedUrl();
  }, [imagePath]);

  // Show loading state
  if (imageLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 ${className}`}>
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  // Show error state with fallback
  if (imageError || !imageSignedUrl) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-100 text-gray-500 ${className}`}>
        <ImageIcon className="w-8 h-8 mb-2" />
        <span className="text-sm">No Image</span>
      </div>
    );
  }

  // Show actual image
  return (
    <Image
      src={imageSignedUrl}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
      priority={priority}
      onError={() => setImageError(true)}
    />
  );
}