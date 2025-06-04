// Test script to verify message types work correctly
const axios = require('axios');

const serverUrl = 'http://localhost:4000';

// Test user credentials (you may need to adjust these)
const testCredentials = {
  email: 'test@example.com',
  password: 'password123'
};

async function testMessageTypes() {
  try {
    console.log('🧪 Starting message type tests...');
    
    // 1. Login to get authentication
    console.log('🔐 Logging in...');
    const loginResponse = await axios.post(`${serverUrl}/api/auth/login`, testCredentials, {
      withCredentials: true
    });
    
    console.log('✅ Login successful');
    
    // 2. Get users to find someone to message
    console.log('👥 Getting users...');
    const usersResponse = await axios.get(`${serverUrl}/api/user/get-other-users`, {
      withCredentials: true
    });
    
    const users = usersResponse.data;
    console.log(`📋 Found ${users.length} users`);
    
    if (users.length === 0) {
      console.log('❌ No other users found to test messaging');
      return;
    }
    
    const testReceiver = users[0];
    console.log(`📤 Testing messages to: ${testReceiver.name || testReceiver.userName}`);
    
    // 3. Test different message types
    console.log('\n🧪 Testing Text Message...');
    const textMessage = await axios.post(`${serverUrl}/api/message/send/${testReceiver._id}`, {
      message: 'Hello! This is a test text message.'
    }, { withCredentials: true });
    console.log('✅ Text message sent:', textMessage.data.messageType);
    
    console.log('\n🧪 Testing Code Message...');
    const codeMessage = await axios.post(`${serverUrl}/api/message/send/${testReceiver._id}`, {
      code: `function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return \`Welcome to Alpha-Chat!\`;
}

greet('Developer');`,
      codeLang: 'javascript'
    }, { withCredentials: true });
    console.log('✅ Code message sent:', codeMessage.data.messageType, 'Language:', codeMessage.data.metadata?.language);
    
    console.log('\n🧪 Testing Terminal Message...');
    const terminalMessage = await axios.post(`${serverUrl}/api/message/send/${testReceiver._id}`, {
      terminal: 'npm install react-syntax-highlighter && npm run dev'
    }, { withCredentials: true });
    console.log('✅ Terminal message sent:', terminalMessage.data.messageType);
    
    // 4. Fetch messages to verify they were stored correctly
    console.log('\n📥 Fetching messages...');
    const messagesResponse = await axios.get(`${serverUrl}/api/message/get/${testReceiver._id}`, {
      withCredentials: true
    });
    
    const messages = messagesResponse.data;
    console.log(`📨 Retrieved ${messages.length} messages`);
    
    // Display message summary
    messages.forEach((msg, index) => {
      console.log(`\n📝 Message ${index + 1}:`);
      console.log(`   Type: ${msg.messageType || 'text'}`);
      console.log(`   Content: ${msg.message.substring(0, 50)}${msg.message.length > 50 ? '...' : ''}`);
      if (msg.metadata) {
        console.log(`   Metadata:`, msg.metadata);
      }
      console.log(`   Timestamp: ${new Date(msg.createdAt).toLocaleString()}`);
    });
    
    console.log('\n🎉 All message type tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testMessageTypes();
