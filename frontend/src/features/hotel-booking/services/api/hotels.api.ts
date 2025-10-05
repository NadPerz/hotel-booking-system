// frontend/src/features/hotel-booking/services/api/hotels.api.ts
import api, { addUserHeaders } from '@/lib/api';

export interface CreateHotelData {
  title: string;
  description: string;
  country: string;
  state: string;
  city: string;
  address?: string;
  locationDescription?: string;
  amenities: {
    gym: boolean;
    spa: boolean;
    bar: boolean;
    laundry: boolean;
    restaurant: boolean;
    shopping: boolean;
    freeParking: boolean;
    bikeRental: boolean;
    freeWifi: boolean;
    movieNights: boolean;
    swimmingPool: boolean;
    coffeeShop: boolean;
  };
  imageFile?: File;
}

export const hotelsApi = {
  // ✅ Get all hotels
  getAll: async () => {
    try {
      console.log('📋 Fetching all hotels...');
      const response = await api.get('/hotels');
      console.log('✅ Hotels fetched successfully:', response.data?.data?.length || 0, 'hotels');
      return response.data?.data || [];
    } catch (error) {
      console.error('❌ Failed to fetch hotels:', error);
      throw error;
    }
  },

  // ✅ Get user's hotels
  getMyHotels: async (currentUser: any) => {
    try {
      console.log('📋 Fetching MY hotels for user:', currentUser.name);
      const headers = addUserHeaders(currentUser);
      
      const response = await api.get('/hotels/my-hotels', { 
        headers: {
          ...headers,
          'Authorization': `Bearer ${currentUser.token}` // Add if you have auth token
        }
      });
      console.log('✅ My hotels fetched successfully:', response.data?.data?.length || 0, 'hotels');
      return response.data?.data || [];
    } catch (error) {
      console.error('❌ Failed to fetch user hotels:', error);
      // ✅ Better error handling
      if ((error as any)?.code === 'ERR_NETWORK') {
        throw new Error('Backend server is not running. Please start your backend server on localhost:3000');
      }
      throw error;
    }
  },

  // ✅ Create hotel
  create: async (hotelData: CreateHotelData, currentUser: any) => {
    try {
      console.log('🆕 Creating hotel via API for user:', currentUser.name);
      console.log('📦 Hotel data to send:', hotelData);
      
      const headers = addUserHeaders(currentUser);
      
      // ✅ Handle form data if image is included
      let requestData: any = hotelData;
      let requestHeaders: Record<string, any> = { ...headers };
      
      if (hotelData.imageFile) {
        const formData = new FormData();
        
        // Append all hotel data
        Object.entries(hotelData).forEach(([key, value]) => {
          if (key === 'imageFile') {
            formData.append('image', value as File);
          } else if (key === 'amenities') {
            formData.append('amenities', JSON.stringify(value));
          } else if (value !== undefined) {
            formData.append(key, String(value));
          }
        });
        
        requestData = formData;
        requestHeaders = {
          ...headers,
          'Content-Type': 'multipart/form-data',
        };
      }
      
      console.log('📤 Sending request to:', `${api.defaults.baseURL}/hotels`);
      console.log('📦 Request headers:', Object.keys(requestHeaders));
      
      const response = await api.post('/hotels', requestData, { 
        headers: requestHeaders 
      });
      
      console.log('✅ Hotel created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Hotel creation failed:', error);
      
      // ✅ Improved error handling
      if (error?.code === 'ERR_NETWORK') {
        throw new Error('Network connection failed. Please check if the backend server is running on localhost:3000');
      }
      
      if (error?.response?.status === 404) {
        throw new Error('Hotel creation endpoint not found. Check if backend routes are properly configured.');
      }
      
      throw error;
    }
  },

  // ✅ Update hotel
  update: async (id: string, hotelData: Partial<CreateHotelData>, currentUser: any) => {
    try {
      console.log('🔄 Updating hotel via API:', id);
      const headers = addUserHeaders(currentUser);
      
      const response = await api.put(`/hotels/${id}`, hotelData, { headers });
      console.log('✅ Hotel updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Hotel update failed:', error);
      throw error;
    }
  },

  // ✅ Delete hotel
  delete: async (id: string, currentUser: any) => {
    try {
      console.log('🗑️ Deleting hotel via API:', id);
      const headers = addUserHeaders(currentUser);
      
      const response = await api.delete(`/hotels/${id}`, { headers });
      console.log('✅ Hotel deleted successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Hotel deletion failed:', error);
      throw error;
    }
  },

  // ✅ Get hotel by ID
  getById: async (id: string) => {
    try {
      console.log('📋 Fetching hotel by ID:', id);
      const response = await api.get(`/hotels/${id}`);
      console.log('✅ Hotel fetched successfully:', response.data?.data?.title);
      return response.data?.data;
    } catch (error) {
      console.error('❌ Failed to fetch hotel:', error);
      throw error;
    }
  },
};

export default hotelsApi;