// Enhanced authentication utilities for production
import axios from 'axios';
import { serverUrl } from '../config/constants';

export const AuthManager = {
  // Helper function to get token from cookies
  getTokenFromCookies: () => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'token' || name === 'authToken') {
        return value;
      }
    }
    return null;
  },

  // Check if user is authenticated with multiple fallbacks
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    const sessionData = sessionStorage.getItem('userSession');
    // Check for both cookie names for compatibility
    const cookieToken = AuthManager.getTokenFromCookies();
    
    return !!(token || userData || sessionData || cookieToken);
  },
  // Set authentication data with persistence
  setAuth: (userData, token) => {
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
      sessionStorage.setItem('userSession', JSON.stringify({
        userId: userData._id,
        timestamp: Date.now()
      }));
    }
    if (token) {
      localStorage.setItem('authToken', token);
      // Set persistent cookie for 7 days to match backend
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      document.cookie = `authToken=${token}; expires=${expiryDate.toUTCString()}; path=/; secure; samesite=lax`;
    }
  },
  // Clear authentication data completely
  clearAuth: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('userSession');
    // Clear both cookies properly
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=lax';
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=lax';
  },

  // Get stored user data with fallback
  getUserData: () => {
    try {
      let userData = localStorage.getItem('userData');
      if (!userData) {
        const sessionData = sessionStorage.getItem('userSession');
        if (sessionData) {
          const session = JSON.parse(sessionData);          // Session is still valid for 7 days (match backend)
          if (Date.now() - session.timestamp < 7 * 24 * 60 * 60 * 1000) {
            return { _id: session.userId };
          }
        }
        return null;
      }
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },
  // Validate session on app start
  validateSession: async () => {
    try {
      // Get token for fallback
      const localToken = localStorage.getItem('authToken');
      const cookieToken = AuthManager.getTokenFromCookies();
      const token = cookieToken || localToken;

      const config = {
        withCredentials: true,
        timeout: 15000,
        headers: {
          'Cache-Control': 'no-cache'
        }
      };

      // Add Authorization header if we have a token but cookies might not work
      if (token && !cookieToken) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.get(`${serverUrl}/api/user/current`, config);
      
      if (response.data) {
        // Update auth data with fresh token if provided
        const responseToken = response.data.token || token;
        AuthManager.setAuth(response.data, responseToken);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Session validation failed:', error);
      // Only clear auth if it's actually an auth error, not network issues
      if (error.response && error.response.status === 401) {
        AuthManager.clearAuth();
      }
      return null;
    }
  }
};

// Handle page unload to maintain session
window.addEventListener('beforeunload', () => {
  const userData = AuthManager.getUserData();
  if (userData) {
    sessionStorage.setItem('userSession', JSON.stringify({
      userId: userData._id,
      timestamp: Date.now()
    }));
  }
});

// Auto-restore session on page load
export const initializeAuth = async () => {
  if (AuthManager.isAuthenticated()) {
    return await AuthManager.validateSession();
  }
  return null;
};