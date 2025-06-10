// Debug script to check Alpha-Chats connectivity
console.log('🔍 Alpha-Chats Debug Script Starting...');

// Check environment variables
console.log('Environment Check:');
console.log('- VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('- VITE_SOCKET_URL:', import.meta.env.VITE_SOCKET_URL);
console.log('- NODE_ENV:', import.meta.env.NODE_ENV);
console.log('- PROD:', import.meta.env.PROD);

// Check constants
import { serverUrl } from '../config/constants.js';
console.log('- Server URL from constants:', serverUrl);

// Test API connectivity
const testAPI = async () => {
  console.log('\n🌐 Testing API Connectivity...');
  
  try {
    // Test basic connectivity
    const healthCheck = await fetch(`${serverUrl}/api/auth/login`, {
      method: 'OPTIONS',
      credentials: 'include'
    });
    console.log('✅ Server is reachable');
    
    // Test current user endpoint
    const userResponse = await fetch(`${serverUrl}/api/user/current`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Current User Response:', {
      status: userResponse.status,
      statusText: userResponse.statusText,
      headers: Object.fromEntries(userResponse.headers.entries())
    });
    
    // Test other users endpoint
    const othersResponse = await fetch(`${serverUrl}/api/user/others`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Other Users Response:', {
      status: othersResponse.status,
      statusText: othersResponse.statusText,
      headers: Object.fromEntries(othersResponse.headers.entries())
    });
    
    if (othersResponse.ok) {
      const othersData = await othersResponse.json();
      console.log('Other Users Data:', othersData);
      console.log('Number of other users:', othersData.length);
    }
    
  } catch (error) {
    console.error('❌ API Test Failed:', error);
  }
};

// Test Socket.IO connectivity
const testSocket = () => {
  console.log('\n🔌 Testing Socket.IO Connectivity...');
  
  // Import socket manager
  import('../Hooks/socketManager.js').then(({ socketManager }) => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    if (userData._id) {
      console.log('Initializing socket for user:', userData._id);
      const socket = socketManager.init(userData._id);
      
      socket.on('connect', () => {
        console.log('✅ Socket connected successfully');
      });
      
      socket.on('onlineUsers', (data) => {
        console.log('👥 Online users received:', data);
      });
      
      socket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
      });
      
    } else {
      console.log('⚠️ No user data found in localStorage');
    }
  });
};

// Run all tests
testAPI();
testSocket();

export { testAPI, testSocket };
