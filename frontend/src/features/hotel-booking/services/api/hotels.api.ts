import api from '@/lib/api';
import { getSignedUploadUrl, uploadFileToSignedUrl } from '@/lib/media-wrapper.api'; // Use wrapper instead
import { Hotel, CreateHotelRequest } from '../../types/hotel.types';

export const hotelApi = {
  // Get all hotels
  getHotels: async (): Promise<Hotel[]> => {
    try {
      const response = await api.get('/hotels');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching hotels:', error);
      return [];
    }
  },

  // Get hotel by ID
  getHotel: async (id: string): Promise<Hotel> => {
    const response = await api.get(`/hotels/${id}`);
    return response.data.data;
  },

  // Create hotel with Minio upload
  createHotel: async (data: CreateHotelRequest & { imageFile?: File }): Promise<Hotel> => {
    let imageUrl = '';
    
    // Handle image upload using wrapper
    if (data.imageFile) {
      try {
        const bucket = 'common-itinerary-ai-storage';
        const fileName = `hotels/hotel_${Date.now()}_${data.imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        
        console.log('🚀 Uploading hotel image:', { fileName, bucket });
        
        // Get signed URL using wrapper
        const signedUrl = await getSignedUploadUrl(fileName, bucket);
        console.log('✅ Got signed URL for hotel image');
        
        // Upload file using wrapper
        imageUrl = await uploadFileToSignedUrl(data.imageFile, signedUrl);
        console.log('✅ Hotel image uploaded successfully:', imageUrl);
        
      } catch (error) {
        console.error('❌ Hotel image upload failed:', error);
        // Use placeholder if upload fails
        imageUrl = `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop`;
      }
    }

    // Prepare hotel data for API
    const hotelData = {
      title: data.title,
      description: data.description,
      image: imageUrl || `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop`,
      country: data.country,
      state: data.state,
      city: data.city,
      locationDescription: data.locationDescription,
      gym: data.gym,
      spa: data.spa,
      bar: data.bar,
      laundry: data.laundry,
      restaurant: data.restaurant,
      shopping: data.shopping,
      freeParking: data.freeParking,
      bikeRental: data.bikeRental,
      freeWifi: data.freeWifi,
      movieNights: data.movieNights,
      swimmingPool: data.swimmingPool,
      coffeeShop: data.coffeeShop,
    };

    console.log('🏨 Creating hotel with data:', hotelData);
    const response = await api.post('/hotels', hotelData);
    return response.data.data;
  },

  // Update hotel
  updateHotel: async (id: string, data: Partial<CreateHotelRequest>): Promise<Hotel> => {
    const response = await api.put(`/hotels/${id}`, data);
    return response.data.data;
  },

  // Delete hotel
  deleteHotel: async (id: string): Promise<void> => {
    await api.delete(`/hotels/${id}`);
  },

  // Get my hotels
  getMyHotels: async (): Promise<Hotel[]> => {
    try {
      const response = await api.get('/hotels/my-hotels');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching my hotels:', error);
      return [];
    }
  },
};