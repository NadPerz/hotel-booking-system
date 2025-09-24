import api from '@/lib/api';
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

  // Create hotel with simplified image handling
  createHotel: async (data: CreateHotelRequest & { imageFile?: File }): Promise<Hotel> => {
    let imageUrl = '';
    
    // Generate a placeholder image URL if file is provided
    if (data.imageFile) {
      // Create a unique filename for Minio (you can implement actual upload later)
      const fileName = `hotel_${Date.now()}_${data.imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      // For now, use a placeholder URL that represents where the image would be stored
      imageUrl = `${process.env.NEXT_PUBLIC_MINIO_ENDPOINT}/${process.env.NEXT_PUBLIC_MINIO_BUCKET_HOTELS}/hotels/${fileName}`;
      
      // Log for debugging
      console.log('Image would be uploaded to:', imageUrl);
      
      // Use Unsplash placeholder for now
      const hotelImages = [
        'photo-1566073771259-6a8506099945',
        'photo-1564501049412-61c2a3083791',
        'photo-1582719478250-c89cae4dc85b',
        'photo-1542314831-068cd1dbfeeb',
      ];
      const randomId = hotelImages[Math.floor(Math.random() * hotelImages.length)];
      imageUrl = `https://images.unsplash.com/${randomId}?w=800&auto=format&fit=crop`;
    }

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