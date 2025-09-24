import api from '@/lib/api';
import { getSignedUploadUrl, uploadFileToSignedUrl } from '@/lib/media.api';
import { Room } from '../../types/room.types';

export const roomsApi = {
  // Get rooms by hotel
  getRoomsByHotel: async (hotelId: string): Promise<Room[]> => {
    try {
      const response = await api.get(`/rooms/hotel/${hotelId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching rooms:', error);
      return [];
    }
  },

  // Get single room
  getRoom: async (roomId: string): Promise<Room> => {
    const response = await api.get(`/rooms/${roomId}`);
    return response.data.data;
  },

  // Create room with your existing Minio upload
  createRoom: async (data: any): Promise<Room> => {
    let imageUrl = '';
    
    if (data.imageFile) {
      try {
        const bucket = 'common-itinerary-ai-storage';
        const fileName = `rooms/room_${Date.now()}_${data.imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        
        console.log('🚀 Uploading room image:', { fileName, bucket });
        
        // Get signed URL using your existing function
        const signedUrl = await getSignedUploadUrl(fileName, bucket);
        console.log('✅ Got signed URL for room image');
        
        // Upload file using your existing function
        imageUrl = await uploadFileToSignedUrl(data.imageFile, signedUrl);
        console.log('✅ Room image uploaded successfully:', imageUrl);
        
      } catch (error) {
        console.error('❌ Room image upload failed:', error);
        // Use placeholder if upload fails
        const roomImages = [
          'photo-1582719478250-c89cae4dc85b',
          'photo-1631049307264-da0ec9d70304',
          'photo-1618773928121-c32242e63f39',
          'photo-1596394516093-501ba68a0ba6',
        ];
        const randomId = roomImages[Math.floor(Math.random() * roomImages.length)];
        imageUrl = `https://images.unsplash.com/${randomId}?w=800&auto=format&fit=crop`;
      }
    }

    const roomData = {
      ...data,
      image: imageUrl,
    };
    delete roomData.imageFile; // Remove the file object

    console.log('🏠 Creating room with data:', roomData);
    const response = await api.post('/rooms', roomData);
    return response.data.data;
  },

  // Update room
  updateRoom: async (roomId: string, data: any): Promise<Room> => {
    const response = await api.put(`/rooms/${roomId}`, data);
    return response.data.data;
  },

  // Delete room
  deleteRoom: async (roomId: string): Promise<void> => {
    await api.delete(`/rooms/${roomId}`);
  },

  // Check availability
  checkAvailability: async (roomId: string, startDate: string, endDate: string): Promise<{ available: boolean }> => {
    const response = await api.get(`/bookings/check-availability/${roomId}?startDate=${startDate}&endDate=${endDate}`);
    return response.data.data;
  },

  // Get available rooms
  getAvailableRooms: async (hotelId: string, startDate: string, endDate: string): Promise<Room[]> => {
    const response = await api.get(`/rooms/available/${hotelId}?startDate=${startDate}&endDate=${endDate}`);
    return response.data.data;
  },
};