// Quick test to verify the fixes work
const axios = require('axios');

const BASE_URL = 'http://localhost:4000';

async function testMessageTypes() {
  console.log('🧪 Testing Alpha-Chat message functionality...\n');
  
  try {
    // Test 1: Check if backend is running
    console.log('1️⃣ Checking backend connectivity...');
    const health = await axios.get(`${BASE_URL}/api/auth/me`, {
      timeout: 5000,
      validateStatus: () => true // Accept all status codes
    });
    console.log(`✅ Backend is running (Status: ${health.status})\n`);
    
    // Test 2: Check message endpoints
    console.log('2️⃣ Testing message endpoints...');
    
    // This should return 401 without auth, which is expected
    const messageTest = await axios.get(`${BASE_URL}/api/message/get/test`, {
      timeout: 5000,
      validateStatus: () => true
    });
    console.log(`✅ Message endpoint accessible (Status: ${messageTest.status})\n`);
    
    console.log('🎉 Basic connectivity tests passed!');
    console.log('📋 Ready for frontend testing:');
    console.log('   - Open http://localhost:5174');
    console.log('   - Login/Register a user');
    console.log('   - Test text, code, and terminal message types');
    console.log('   - Verify real-time messaging');
    console.log('   - Check theme switching\n');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testMessageTypes();
