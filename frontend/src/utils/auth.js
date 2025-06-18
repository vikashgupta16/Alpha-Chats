// Enhanced authentication utilities for production
import axios from 'axios';
import { serverUrl } from '../config/constants';

export const AuthManager = {
  // Check if user is authenticated with multiple fallbacks
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    const sessionData = sessionStorage.getItem('userSession');
    const cookies = document.cookie.includes('authToken');
    
    return !!(token || userData || sessionData || cookies);
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
      // Set persistent cookie for 30 days
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      document.cookie = `authToken=${token}; expires=${expiryDate.toUTCString()}; path=/; secure; samesite=lax`;
    }
  },

  // Clear authentication data completely
  clearAuth: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('userSession');
    // Clear cookie properly
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=lax';
  },

  // Get stored user data with fallback
  getUserData: () => {
    try {
      let userData = localStorage.getItem('userData');
      if (!userData) {
        const sessionData = sessionStorage.getItem('userSession');
        if (sessionData) {
          const session = JSON.parse(sessionData);
          // Session is still valid for 24 hours
          if (Date.now() - session.timestamp < 24 * 60 * 60 * 1000) {
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
      const response = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
        timeout: 15000,
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (response.data) {
        AuthManager.setAuth(response.data, response.data.token);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Session validation failed:', error);
      AuthManager.clearAuth();
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