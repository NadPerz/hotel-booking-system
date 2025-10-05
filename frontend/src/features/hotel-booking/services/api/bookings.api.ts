// frontend/src/features/hotel-booking/services/api/bookings.api.ts
import api from '@/lib/api';
import { useCurrentUser } from '../../hooks/useCurrentUser'; // Fixed import path

export interface CreateBookingData {
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  guestInfo: {
    name: string;
    email: string;
    phone: string;
  };
  specialRequests?: string;
}

export interface Booking {
  id: string;
  paymentId?: string;
  hotelId: string;
  hotelName?: string;
  hotelCity?: string;
  hotelCountry?: string;
  roomId: string;
  roomName?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
  canCancel: boolean;
}

export const bookingsApi = {
  // Create a new booking
  create: async (bookingData: CreateBookingData): Promise<Booking> => {
    console.log('📅 Creating booking with dynamic user context:', {
      ...bookingData,
      timestamp: new Date().toISOString()
    });

    try {
      // Transform to backend expected format
      const backendBookingData = {
        roomId: bookingData.roomId,
        hotelId: bookingData.hotelId,
        hotelOwnerId: 'default-user', // Backend will use header or default
        startDate: new Date(bookingData.checkIn + 'T00:00:00.000Z').toISOString(),
        endDate: new Date(bookingData.checkOut + 'T00:00:00.000Z').toISOString(),
        breakfastIncluded: false,
        currency: 'USD',
        totalPrice: bookingData.totalPrice,
        guests: bookingData.guests,
        guestName: bookingData.guestInfo.name,
        guestEmail: bookingData.guestInfo.email,
        guestPhone: bookingData.guestInfo.phone,
        specialRequests: bookingData.specialRequests || ''
      };

      console.log('🌐 Sending to /api/bookings:', backendBookingData);
      
      const response = await api.post('/bookings', backendBookingData);
      
      console.log('✅ Booking created successfully:', response.data);
      
      const backendBooking = response.data.data || response.data;
      
      // Transform backend response to frontend format
      const frontendBooking: Booking = {
        id: backendBooking.id || backendBooking._id,
        paymentId: backendBooking.paymentIntentId || '',
        hotelId: backendBooking.hotelId,
        hotelName: backendBooking.hotel?.title || 'Hotel',
        hotelCity: backendBooking.hotel?.city || 'City',
        hotelCountry: backendBooking.hotel?.country || 'Country',
        roomId: backendBooking.roomId,
        roomName: backendBooking.room?.title || 'Room',
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.guests,
        totalPrice: backendBooking.totalPrice,
        status: backendBooking.paymentStatus ? 'confirmed' : 'pending',
        guestName: bookingData.guestInfo.name,
        guestEmail: bookingData.guestInfo.email,
        guestPhone: bookingData.guestInfo.phone,
        specialRequests: bookingData.specialRequests,
        createdAt: backendBooking.createdAt || new Date().toISOString(),
        updatedAt: backendBooking.updatedAt || new Date().toISOString(),
        canCancel: true
      };

      return frontendBooking;
      
    } catch (error: any) {
      console.error('❌ Booking creation failed:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        timestamp: new Date().toISOString()
      });
      
      throw new Error(error.response?.data?.message || 'Failed to create booking');
    }
  },

  // Get user bookings
  getUserBookings: async (userId?: string): Promise<Booking[]> => {
    try {
      console.log('📅 Fetching user bookings with dynamic user context');
      
      const response = await api.get('/bookings/my-bookings');
      
      console.log('✅ Backend bookings response:', response.data);
      
      const backendBookings = response.data.data || response.data || [];
      
      const frontendBookings: Booking[] = backendBookings.map((booking: any) => ({
        id: booking.id || booking._id,
        paymentId: booking.paymentIntentId || '',
        hotelId: booking.hotelId,
        hotelName: booking.hotel?.title || 'Hotel',
        hotelCity: booking.hotel?.city || 'City',
        hotelCountry: booking.hotel?.country || 'Country',
        roomId: booking.roomId,
        roomName: booking.room?.title || 'Room',
        checkIn: booking.startDate ? new Date(booking.startDate).toISOString().split('T')[0] : '',
        checkOut: booking.endDate ? new Date(booking.endDate).toISOString().split('T')[0] : '',
        guests: booking.guests || 2,
        totalPrice: booking.totalPrice,
        status: booking.paymentStatus ? 'confirmed' : 'pending',
        guestName: booking.guestName || 'Guest',
        guestEmail: booking.guestEmail || 'guest@example.com',
        guestPhone: booking.guestPhone || '',
        specialRequests: booking.specialRequests || '',
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        canCancel: true
      }));

      console.log('✅ Transformed bookings for frontend:', frontendBookings.length);
      return frontendBookings;
      
    } catch (error: any) {
      console.error('❌ Failed to fetch user bookings:', error);
      return [];
    }
  },

  // Get all bookings (for hotel owners)
  getAll: async (): Promise<Booking[]> => {
    try {
      const response = await api.get('/bookings/hotel-bookings');
      
      const backendBookings = response.data.data || response.data || [];
      
      const frontendBookings: Booking[] = backendBookings.map((booking: any) => ({
        id: booking.id || booking._id,
        paymentId: booking.paymentIntentId || '',
        hotelId: booking.hotelId,
        hotelName: booking.hotel?.title || 'Hotel',
        hotelCity: booking.hotel?.city || 'City',
        hotelCountry: booking.hotel?.country || 'Country',
        roomId: booking.roomId,
        roomName: booking.room?.title || 'Room',
        checkIn: booking.startDate ? new Date(booking.startDate).toISOString().split('T')[0] : '',
        checkOut: booking.endDate ? new Date(booking.endDate).toISOString().split('T')[0] : '',
        guests: booking.guests || 2,
        totalPrice: booking.totalPrice,
        status: booking.paymentStatus ? 'confirmed' : 'pending',
        guestName: booking.guestName || 'Guest',
        guestEmail: booking.guestEmail || 'guest@example.com',
        guestPhone: booking.guestPhone || '',
        specialRequests: booking.specialRequests || '',
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        canCancel: true
      }));

      return frontendBookings;
      
    } catch (error: any) {
      console.error('❌ Failed to fetch all bookings:', error);
      return [];
    }
  },

  // Update payment status
  updatePaymentStatus: async (bookingId: string, paymentStatus: boolean, paymentIntentId?: string): Promise<boolean> => {
    try {
      const updateData = {
        paymentStatus,
        paymentIntentId: paymentIntentId || `pi_${Date.now()}_default`
      };
      
      const response = await api.put(`/bookings/${bookingId}/status`, updateData);
      
      console.log('✅ Payment status updated');
      return true;
      
    } catch (error: any) {
      console.error('❌ Payment status update failed:', error);
      return false;
    }
  },

  // Cancel booking
  cancel: async (bookingId: string): Promise<boolean> => {
    try {
      await api.delete(`/bookings/${bookingId}`);
      
      console.log('✅ Booking cancelled successfully');
      return true;
      
    } catch (error: any) {
      console.error('❌ Booking cancellation failed:', error);
      return false;
    }
  },

  // Check room availability
  checkAvailability: async (roomId: string, startDate: string, endDate: string): Promise<boolean> => {
    try {
      const response = await api.get(`/bookings/check-availability/${roomId}?startDate=${startDate}&endDate=${endDate}`);
      return response.data.data?.available ?? true;
    } catch (error) {
      console.error('❌ Availability check failed:', error);
      return true; // Default to available
    }
  },

  // Update booking status
  updateStatus: async (bookingId: string, status: string): Promise<boolean> => {
    const paymentStatus = status === 'confirmed';
    return await bookingsApi.updatePaymentStatus(bookingId, paymentStatus);
  }
};

export default bookingsApi;