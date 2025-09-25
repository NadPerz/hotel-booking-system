import { useQuery } from '@tanstack/react-query';
import { analyticsApi, RevenueData, BookingStats, HotelStats } from '../services/api/analytics.api';

export const useAnalytics = () => {
  // Revenue data - Mock data with realistic delay
  const {
    data: revenueData,
    isLoading: isLoadingRevenue,
    error: revenueError
  } = useQuery({
    queryKey: ['analytics', 'revenue'],
    queryFn: () => analyticsApi.getRevenueData(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Booking stats - Mock data
  const {
    data: bookingStats,
    isLoading: isLoadingBookings,
    error: bookingError
  } = useQuery({
    queryKey: ['analytics', 'bookings'],
    queryFn: () => analyticsApi.getBookingStats(),
    staleTime: 1000 * 60 * 5,
  });

  // Hotel stats - Uses REAL data from your hotels API
  const {
    data: hotelStats,
    isLoading: isLoadingHotels,
    error: hotelError
  } = useQuery({
    queryKey: ['analytics', 'hotels'],
    queryFn: () => analyticsApi.getRealHotelStats(), // This uses real hotel count!
    staleTime: 1000 * 60 * 5,
  });

  // Monthly revenue chart - Mock data
  const {
    data: monthlyRevenue = [],
    isLoading: isLoadingMonthlyRevenue
  } = useQuery({
    queryKey: ['analytics', 'monthly-revenue'],
    queryFn: () => analyticsApi.getMonthlyRevenue(),
    staleTime: 1000 * 60 * 10,
  });

  // Occupancy trends - Mock data
  const {
    data: occupancyTrends = [],
    isLoading: isLoadingOccupancy
  } = useQuery({
    queryKey: ['analytics', 'occupancy'],
    queryFn: () => analyticsApi.getOccupancyTrends(),
    staleTime: 1000 * 60 * 10,
  });

  return {
    // Data
    revenueData,
    bookingStats,
    hotelStats, // This will show your ACTUAL hotel count!
    monthlyRevenue,
    occupancyTrends,
    
    // Loading states
    isLoadingRevenue,
    isLoadingBookings,
    isLoadingHotels,
    isLoadingMonthlyRevenue,
    isLoadingOccupancy,
    
    // Errors
    revenueError,
    bookingError,
    hotelError,
    
    // Overall loading state
    isLoading: isLoadingRevenue || isLoadingBookings || isLoadingHotels,
  };
};

// Individual hooks for specific data
export const useRevenueData = () => {
  return useQuery({
    queryKey: ['analytics', 'revenue'],
    queryFn: () => analyticsApi.getRevenueData(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useRealHotelStats = () => {
  return useQuery({
    queryKey: ['analytics', 'real-hotels'],
    queryFn: () => analyticsApi.getRealHotelStats(),
    staleTime: 1000 * 60 * 2, // Refresh more frequently for real data
  });
};