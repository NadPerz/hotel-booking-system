import axios from 'axios';

// Hotel booking specific API configuration
const HOTEL_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

console.log('🏨 Hotel Booking API Base URL:', HOTEL_API_BASE_URL);
console.log('🕐 Current Date (UTC):', new Date().toISOString());
console.log('👤 Current User:', 'NadPerz');

const hotelApi = axios.create({
  baseURL: HOTEL_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-User-Login': 'NadPerz',
    'X-Request-Timestamp': new Date().toISOString(),
  },
  timeout: 30000, // 30 seconds timeout for hotel operations
});

// Request interceptor for hotel booking API
hotelApi.interceptors.request.use(
  (config) => {
    // Add current timestamp and user to all requests
    config.headers['X-Request-Timestamp'] = new Date().toISOString();
    config.headers['X-User-Login'] = 'NadPerz';
    
    console.log(`🏨 Hotel API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    console.log('📅 Request Time (UTC):', new Date().toISOString().replace('T', ' ').substring(0, 19));
    
    if (config.data) {
      console.log('📦 Request Data:', config.data);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Hotel API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for hotel booking API
hotelApi.interceptors.response.use(
  (response) => {
    console.log(`✅ Hotel API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    console.log('📅 Response Time (UTC):', new Date().toISOString().replace('T', ' ').substring(0, 19));
    
    if (response.data) {
      const dataCount = Array.isArray(response.data.data) ? response.data.data.length : 'N/A';
      console.log('📊 Response Data Count:', dataCount);
    }
    
    return response;
  },
  (error) => {
    const errorInfo = {
      url: error.config?.url || 'Unknown URL',
      method: error.config?.method?.toUpperCase() || 'Unknown Method',
      status: error.response?.status || 'No Status',
      message: error.message,
      baseURL: error.config?.baseURL || 'No Base URL',
      fullURL: `${error.config?.baseURL}${error.config?.url}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: 'NadPerz'
    };

    // Handle specific hotel booking API errors
    if (error.response?.status === 404) {
      if (error.config?.url?.includes('/hotels/')) {
        console.warn(`⚠️ Hotel not found: ${errorInfo.fullURL}`);
      } else if (error.config?.url?.includes('/rooms/')) {
        console.warn(`⚠️ Room not found: ${errorInfo.fullURL}`);
      } else if (error.config?.url?.includes('/bookings/')) {
        console.warn(`⚠️ Booking not found: ${errorInfo.fullURL}`);
      } else {
        console.warn(`⚠️ Resource not found: ${errorInfo.fullURL}`);
      }
    } else if (error.response?.status === 401) {
      console.error('🔐 Authentication required for hotel booking API');
    } else if (error.response?.status === 403) {
      console.error('🚫 Access forbidden for hotel booking operation');
    } else if (error.response?.status === 500) {
      console.error('💥 Hotel booking server error:', errorInfo);
    } else {
      console.error('❌ Hotel API Response Error:', errorInfo);
    }
    
    return Promise.reject(error);
  }
);

// Hotel booking specific API methods
export const hotelBookingApi = {
  // Base API instance
  client: hotelApi,
  
  // Helper method to log API calls
  logApiCall: (operation: string, data?: any) => {
    console.log(`🏨 ${operation}:`, {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: 'NadPerz',
      data: data || 'No data'
    });
  },
  
  // Helper method for error handling
  handleApiError: (error: any, operation: string) => {
    console.error(`❌ ${operation} failed:`, {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: 'NadPerz',
      error: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

export default hotelApi;