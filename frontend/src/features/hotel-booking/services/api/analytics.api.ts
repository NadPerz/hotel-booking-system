import api from '@/lib/api';

export interface RevenueData {
  totalRevenue: number;
  monthlyRevenue: number;
  totalBookings: number;
  monthlyBookings: number;
  occupancyRate: number;
  averageRoomRate: number;
}

export interface BookingStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
}

export interface HotelStats {
  totalHotels: number;
  totalRooms: number;
  activeHotels: number;
  averageRating: number;
}

// Generate realistic mock data based on current user and date
const generateMockData = () => {
  const currentDate = new Date('2025-09-24T15:14:49Z');
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  
  // Generate data that makes sense for NadPerz's hotels
  const mockRevenueData: RevenueData = {
    totalRevenue: 125750.80,
    monthlyRevenue: 18945.50,
    totalBookings: 247,
    monthlyBookings: 34,
    occupancyRate: 78.5,
    averageRoomRate: 156.75,
  };

  const mockBookingStats: BookingStats = {
    totalBookings: 247,
    pendingBookings: 12,
    confirmedBookings: 198,
    cancelledBookings: 37,
  };

  const mockHotelStats: HotelStats = {
    totalHotels: 3, // Based on your current hotels
    totalRooms: 0, // Will be calculated from actual rooms when you create them
    activeHotels: 3,
    averageRating: 4.2,
  };

  const mockMonthlyRevenue = [
    { month: 'Jan', revenue: 12450.50, bookings: 28 },
    { month: 'Feb', revenue: 15680.75, bookings: 35 },
    { month: 'Mar', revenue: 18920.25, bookings: 42 },
    { month: 'Apr', revenue: 16750.80, bookings: 38 },
    { month: 'May', revenue: 21340.60, bookings: 48 },
    { month: 'Jun', revenue: 19850.45, bookings: 44 },
    { month: 'Jul', revenue: 23150.90, bookings: 52 },
    { month: 'Aug', revenue: 20945.35, bookings: 46 },
    { month: 'Sep', revenue: 18945.50, bookings: 34 }, // Current month
  ];

  const mockOccupancyTrends = [
    { date: '2025-09-17', occupancy: 82.5, revenue: 2850.40 },
    { date: '2025-09-18', occupancy: 78.3, revenue: 2654.75 },
    { date: '2025-09-19', occupancy: 85.7, revenue: 3125.80 },
    { date: '2025-09-20', occupancy: 79.2, revenue: 2789.60 },
    { date: '2025-09-21', occupancy: 91.4, revenue: 3456.90 },
    { date: '2025-09-22', occupancy: 87.8, revenue: 3287.45 },
    { date: '2025-09-23', occupancy: 83.6, revenue: 2945.20 },
    { date: '2025-09-24', occupancy: 78.5, revenue: 2835.45 }, // Today
  ];

  return {
    mockRevenueData,
    mockBookingStats,
    mockHotelStats,
    mockMonthlyRevenue,
    mockOccupancyTrends,
  };
};

export const analyticsApi = {
  // Get revenue data - Returns mock data instead of API call
  getRevenueData: async (): Promise<RevenueData> => {
    console.log('📊 Analytics: Using mock revenue data (backend endpoint not implemented yet)');
    
    // Simulate API delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { mockRevenueData } = generateMockData();
    return mockRevenueData;
  },

  // Get booking statistics - Returns mock data
  getBookingStats: async (): Promise<BookingStats> => {
    console.log('📊 Analytics: Using mock booking stats (backend endpoint not implemented yet)');
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const { mockBookingStats } = generateMockData();
    return mockBookingStats;
  },

  // Get hotel statistics - Returns mock data  
  getHotelStats: async (): Promise<HotelStats> => {
    console.log('📊 Analytics: Using mock hotel stats (backend endpoint not implemented yet)');
    
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const { mockHotelStats } = generateMockData();
    return mockHotelStats;
  },

  // Get monthly revenue chart data - Returns mock data
  getMonthlyRevenue: async (year: number = new Date().getFullYear()): Promise<any[]> => {
    console.log(`📊 Analytics: Using mock monthly revenue for ${year} (backend endpoint not implemented yet)`);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const { mockMonthlyRevenue } = generateMockData();
    return mockMonthlyRevenue;
  },

  // Get occupancy trends - Returns mock data
  getOccupancyTrends: async (): Promise<any[]> => {
    console.log('📊 Analytics: Using mock occupancy trends (backend endpoint not implemented yet)');
    
    await new Promise(resolve => setTimeout(resolve, 450));
    
    const { mockOccupancyTrends } = generateMockData();
    return mockOccupancyTrends;
  },

  // Get real-time stats from existing APIs (these work!)
  getRealHotelStats: async (): Promise<HotelStats> => {
    try {
      console.log('📊 Analytics: Fetching REAL hotel statistics...');
      
      // Get actual hotel count from your working API
      const hotelsResponse = await api.get('/hotels/my-hotels');
      const hotels = hotelsResponse.data.data || [];
      
      // You can add room counting when rooms are implemented
      // const roomsResponse = await api.get('/rooms'); // When implemented
      
      const realStats: HotelStats = {
        totalHotels: hotels.length,
        totalRooms: 0, // Will be calculated when rooms are implemented
        activeHotels: hotels.length,
        averageRating: 4.2, // Mock for now
      };
      
      console.log('✅ Analytics: Real hotel stats fetched:', realStats);
      return realStats;
      
    } catch (error) {
      console.warn('⚠️ Analytics: Falling back to mock hotel stats');
      const { mockHotelStats } = generateMockData();
      return mockHotelStats;
    }
  },
};

// Helper function to check if backend analytics endpoints are available
export const checkAnalyticsEndpoints = async (): Promise<boolean> => {
  try {
    await api.get('/analytics/revenue');
    console.log('✅ Analytics endpoints are available');
    return true;
  } catch (error) {
    console.log('📊 Analytics endpoints not implemented yet, using mock data');
    return false;
  }
};

export default analyticsApi;