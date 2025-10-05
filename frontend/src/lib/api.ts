// frontend/src/lib/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

export const addUserHeaders = (currentUser: any) => {
  return {
    'x-user-id': currentUser.id,
    'X-User-Login': currentUser.login,
    'x-branch-id': currentUser.businessProfile?.branchId || '',
    'x-business-account-id': currentUser.businessProfile?.businessAccountId || '',
    'x-user-first-name': currentUser.businessProfile?.firstName || '',
    'x-user-last-name': currentUser.businessProfile?.lastName || '',
    'x-user-type': currentUser.userType
  };
};

api.interceptors.request.use(
  (config) => {
    console.log('🌐 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      fullUrl: `${config.baseURL}${config.url}`,
      headers: {
        'x-user-id': config.headers['x-user-id'],
        'x-user-first-name': config.headers['x-user-first-name'],
        'x-user-last-name': config.headers['x-user-last-name']
      }
    });
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ API Success:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    
    if (error.code === 'ERR_NETWORK') {
      console.error('🔴 Backend server not reachable on http://localhost:3000');
      console.error('💡 Make sure your backend is running');
      console.error('💡 Check CORS configuration');
    }
    
    return Promise.reject(error);
  }
);

export default api;