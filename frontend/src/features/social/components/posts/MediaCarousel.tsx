// src/features/social/components/MediaCarousel.tsx
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@frontend/components/ui/carousel";
import { Skeleton } from "@frontend/components/ui/skeleton";

interface MediaCarouselProps {
  urls: string[];
  loading: boolean;
  error: boolean;
  containerHeight: number | null;
  maxHeight: number;
  onFirstMediaHeight: (height: number, index: number) => void;
}

export const MediaCarousel: React.FC<MediaCarouselProps> = ({
  urls,
  loading,
  error,
  containerHeight,
  maxHeight,
  onFirstMediaHeight,
}) => {
  const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url.split("?")[0]);

  if (loading) {
    return (
      <div className="space-y-2 mb-3">
        <Skeleton
          className="w-full rounded-lg"
          style={{ height: `${maxHeight}px` }}
        />
        <div className="flex justify-center space-x-2">
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-2 w-2 rounded-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg text-red-500 mb-3">
        Failed to load media
      </div>
    );
  }

  if (urls.length === 0) return null;

  return (
    <div className="mb-3">
      <Carousel className="w-full">
        <CarouselContent>
          {urls.map((url, index) => (
            <CarouselItem key={index}>
              <div
                className="relative rounded-lg overflow-hidden flex items-center justify-center bg-gray-100"
                style={{
                  height: containerHeight
                    ? `${containerHeight}px`
                    : `${maxHeight}px`,
                  maxHeight: `${maxHeight}px`,
                }}
              >
                {isVideo(url) ? (
                  <video
                    src={url}
                    controls
                    className="max-h-full max-w-full object-contain bg-black"
                    style={{ maxHeight: `${maxHeight}px` }}
                    onLoadedMetadata={(e) => {
                      const h = (e.target as HTMLVideoElement).videoHeight;
                      onFirstMediaHeight(h, index);
                    }}
                  />
                ) : (
                  <img
                    src={url}
                    alt="Post media"
                    className="max-h-full max-w-full object-contain bg-gray-200"
                    style={{ maxHeight: `${maxHeight}px` }}
                    onLoad={(e) => {
                      const h = (e.target as HTMLImageElement).naturalHeight;
                      onFirstMediaHeight(h, index);
                    }}
                  />
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {urls.length > 1 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
    </div>
  );
};
