// Test authentication and API endpoints
const axios = require('axios');

const serverUrl = 'http://localhost:4000';

async function testAPIs() {
    console.log('🧪 Testing Alpha-Chats APIs...\n');
    
    try {
        // Step 1: Login with test user
        console.log('1️⃣ Logging in with test user...');
        const loginResponse = await axios.post(`${serverUrl}/api/auth/login`, {
            github: 'testuser1',
            password: 'password123'
        }, {
            withCredentials: true
        });
        
        console.log('✅ Login successful:', loginResponse.data.userName);
        
        // Extract cookie for subsequent requests
        const cookies = loginResponse.headers['set-cookie'];
        const cookieHeader = cookies ? cookies.join('; ') : '';
        
        // Step 2: Test getCurrentUser
        console.log('\n2️⃣ Testing getCurrentUser API...');
        const currentUserResponse = await axios.get(`${serverUrl}/api/user/current`, {
            headers: {
                'Cookie': cookieHeader
            }
        });
        
        console.log('✅ Current user:', currentUserResponse.data.userName);
        
        // Step 3: Test getOtherUsers  
        console.log('\n3️⃣ Testing getOtherUsers API...');
        const otherUsersResponse = await axios.get(`${serverUrl}/api/user/others`, {
            headers: {
                'Cookie': cookieHeader
            }
        });
        
        console.log('✅ Other users found:', otherUsersResponse.data.length);
        otherUsersResponse.data.forEach((user, index) => {
            console.log(`   ${index + 1}. ${user.userName} (${user._id})`);
        });
        
        console.log('\n🎉 All API tests passed!');
        
    } catch (error) {
        console.error('❌ API test failed:', error.response?.data || error.message);
    }
}

testAPIs();
