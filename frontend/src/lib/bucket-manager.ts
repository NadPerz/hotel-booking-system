// Simplified bucket management for hotel booking system
export const BUCKET_CONFIG = {
  hotels: {
    bucketName: 'hotel-bucket',
    folder: 'images'
  },
  rooms: {
    bucketName: 'room-bucket', 
    folder: 'images'
  }
} as const;

export type ResourceType = keyof typeof BUCKET_CONFIG;

export const getBucketConfig = (resourceType: ResourceType) => {
  return BUCKET_CONFIG[resourceType];
};

export const generateFileName = (resourceType: ResourceType, originalName: string, userId: string = 'NadPerz'): string => {
  const timestamp = Date.now();
  const cleanName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const config = getBucketConfig(resourceType);
  
  // Format: rooms_NadPerz_1727182847000_room_image.jpg
  return `${config.folder}/${resourceType}_${userId}_${timestamp}_${cleanName}`;
};