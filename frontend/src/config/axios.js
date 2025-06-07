import axios from 'axios';

// Configure axios defaults for all requests
axios.defaults.withCredentials = true;

// Add request interceptor for debugging
axios.interceptors.request.use(
  (config) => {
    // Only set JSON Content-Type if no FormData is being sent
    if (!config.data || !(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    console.log('Making request to:', config.url);
    console.log('With credentials:', config.withCredentials);
    console.log('Content-Type:', config.headers['Content-Type']);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axios.interceptors.response.use(
  (response) => {
    console.log('Response received from:', response.config.url);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default axios;
