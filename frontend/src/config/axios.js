import axios from 'axios';
import { serverUrl } from './constants.js';
import TokenManager from '../utils/tokenManager.js';

// Clean URL helper to prevent double slashes
const cleanUrl = (url) => {
  return url.replace(/([^:]\/)\/+/g, '$1');
};

// Configure axios defaults for all requests
axios.defaults.withCredentials = true;
axios.defaults.timeout = 15000; // 15 second timeout

// Add request interceptor for debugging and URL cleaning
axios.interceptors.request.use(
  (config) => {
    // Clean the URL to prevent double slashes
    if (config.url) {
      const baseUrl = config.baseURL || serverUrl;
      const fullUrl = config.url.startsWith('http') ? config.url : `${baseUrl}${config.url}`;
      config.url = cleanUrl(fullUrl);
      
      // Remove baseURL to prevent double concatenation
      delete config.baseURL;
    }
    
    // Add Authorization header as fallback for cookie issues (especially in Simple Browser)
    const token = TokenManager.getToken();
    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('🔑 [axios] Added Authorization header for', config.url);
    }
    
    // Only set JSON Content-Type if no FormData is being sent
    if (!config.data || !(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    console.log('Making request to:', config.url);
    console.log('With credentials:', config.withCredentials);
    console.log('Content-Type:', config.headers['Content-Type']);
    console.log('Authorization header:', config.headers['Authorization'] ? 'Present' : 'Missing');
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging and error handling
axios.interceptors.response.use(
  (response) => {
    console.log('Response received from:', response.config.url);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.data);
    
    // Enhanced error logging for CORS issues
    if (error.code === 'ERR_NETWORK') {
      console.error('🚨 Network Error - Possible causes:');
      console.error('1. CORS policy blocking the request');
      console.error('2. Backend server is down');
      console.error('3. Invalid backend URL');
      console.error('4. Network connectivity issues');
      console.error('Current backend URL:', serverUrl);
    }
    
    return Promise.reject(error);
  }
);

export default axios;
