// Create test users for message testing
const axios = require('axios');

const serverUrl = 'http://localhost:4000';

async function createTestUsers() {
  try {
    console.log('👥 Creating test users...');
    
    // Create first test user
    const user1 = {
      name: 'Test User 1',
      userName: 'testuser1',
      email: 'testuser1@example.com',
      password: 'password123',
      github: 'testuser1'
    };
    
    // Create second test user  
    const user2 = {
      name: 'Test User 2',
      userName: 'testuser2',
      email: 'testuser2@example.com',
      password: 'password123',
      github: 'testuser2'
    };
    
    try {
      const response1 = await axios.post(`${serverUrl}/api/auth/register`, user1);
      console.log('✅ Created user 1:', user1.userName);
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('ℹ️ User 1 already exists');
      } else {
        console.log('❌ Error creating user 1:', error.response?.data || error.message);
      }
    }
    
    try {
      const response2 = await axios.post(`${serverUrl}/api/auth/register`, user2);
      console.log('✅ Created user 2:', user2.userName);
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('ℹ️ User 2 already exists');
      } else {
        console.log('❌ Error creating user 2:', error.response?.data || error.message);
      }
    }
    
    console.log('\n🎯 Test users ready! You can now test messaging between:');
    console.log(`📧 ${user1.email} / ${user1.password}`);
    console.log(`📧 ${user2.email} / ${user2.password}`);
    
  } catch (error) {
    console.error('❌ Failed to create test users:', error.message);
  }
}

createTestUsers();
