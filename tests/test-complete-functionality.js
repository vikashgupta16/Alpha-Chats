// Complete functionality test for Alpha-Chat
import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

// Test user credentials
const testUsers = [
  { email: 'user1@test.com', password: 'password123', name: 'Test User 1' },
  { email: 'user2@test.com', password: 'password123', name: 'Test User 2' }
];

let tokens = {};
let userIds = {};

async function registerAndLoginUsers() {
  console.log('🔐 Setting up test users...');
  
  for (let i = 0; i < testUsers.length; i++) {
    const user = testUsers[i];
    
    try {
      // Try to register user (might already exist)
      const registerRes = await axios.post(`${API_BASE}/auth/signup`, user);
      console.log(`✅ Registered ${user.name}`);
    } catch (error) {
      if (error.response?.status === 400) {
        console.log(`ℹ️  ${user.name} already exists`);
      }
    }
    
    // Login user
    try {
      const loginRes = await axios.post(`${API_BASE}/auth/login`, {
        email: user.email,
        password: user.password
      });
      
      tokens[`user${i + 1}`] = loginRes.data.token;
      userIds[`user${i + 1}`] = loginRes.data.user._id;
      console.log(`✅ Logged in ${user.name} - ID: ${userIds[`user${i + 1}`]}`);
    } catch (error) {
      console.error(`❌ Failed to login ${user.name}:`, error.message);
      return false;
    }
  }
  
  return true;
}

async function testMessageTypes() {
  console.log('\n📨 Testing different message types...');
  
  const receiverId = userIds.user2;
  const senderToken = tokens.user1;
  
  // Test messages
  const testMessages = [
    {
      type: 'text',
      data: { message: 'Hello! This is a regular text message.' },
      description: 'Text Message'
    },
    {
      type: 'code',
      data: { 
        code: 'function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}',
        codeLang: 'javascript'
      },
      description: 'JavaScript Code'
    },
    {
      type: 'code',
      data: {
        code: 'def quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + middle + quicksort(right)',
        codeLang: 'python'
      },
      description: 'Python Code'
    },
    {
      type: 'terminal',
      data: { terminal: 'ls -la | grep -E "\\.(js|ts)$"' },
      description: 'Terminal Command'
    },
    {
      type: 'terminal',
      data: { terminal: 'docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"' },
      description: 'Docker Command'
    }
  ];
  
  for (const test of testMessages) {
    try {
      const response = await axios.post(
        `${API_BASE}/message/send/${receiverId}`,
        test.data,
        {
          headers: {
            'Authorization': `Bearer ${senderToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log(`✅ Sent ${test.description}:`, {
        id: response.data._id,
        type: response.data.messageType,
        content: response.data.message?.substring(0, 50) + '...'
      });
      
      // Small delay between messages
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`❌ Failed to send ${test.description}:`, error.response?.data || error.message);
    }
  }
}

async function testMessageRetrieval() {
  console.log('\n📥 Testing message retrieval...');
  
  const senderId = userIds.user1;
  const receiverId = userIds.user2;
  const token = tokens.user1;
  
  try {
    const response = await axios.get(
      `${API_BASE}/message/get/${receiverId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log(`✅ Retrieved ${response.data.length} messages`);
    
    // Display message summary
    response.data.forEach((msg, index) => {
      console.log(`  ${index + 1}. ${msg.messageType.toUpperCase()}: ${msg.message?.substring(0, 40)}${msg.message?.length > 40 ? '...' : ''}`);
      if (msg.metadata && Object.keys(msg.metadata).length > 0) {
        console.log(`     Metadata: ${JSON.stringify(msg.metadata)}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Failed to retrieve messages:', error.response?.data || error.message);
  }
}

async function testBidirectionalChat() {
  console.log('\n💬 Testing bidirectional chat...');
  
  // User 2 sends messages back to User 1
  const receiverId = userIds.user1;
  const senderToken = tokens.user2;
  
  const responses = [
    { message: 'Thanks for the code examples! Here\'s my response.' },
    { 
      code: 'console.log("Hello from User 2!");', 
      codeLang: 'javascript' 
    },
    { terminal: 'echo "Message received and processed"' }
  ];
  
  for (const response of responses) {
    try {
      await axios.post(
        `${API_BASE}/message/send/${receiverId}`,
        response,
        {
          headers: {
            'Authorization': `Bearer ${senderToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('✅ User 2 sent response');
    } catch (error) {
      console.error('❌ Failed to send response:', error.message);
    }
  }
  
  // Now retrieve messages from User 1's perspective
  try {
    const messages = await axios.get(
      `${API_BASE}/message/get/${userIds.user2}`,
      {
        headers: {
          'Authorization': `Bearer ${tokens.user1}`
        }
      }
    );
    
    console.log(`✅ Full conversation has ${messages.data.length} messages`);
  } catch (error) {
    console.error('❌ Failed to retrieve full conversation:', error.message);
  }
}

// Main test execution
async function runTests() {
  console.log('🚀 Starting Alpha-Chat Complete Functionality Test\n');
  
  try {
    const loginSuccess = await registerAndLoginUsers();
    if (!loginSuccess) {
      console.error('❌ Failed to setup users. Aborting tests.');
      return;
    }
    
    await testMessageTypes();
    await testMessageRetrieval();
    await testBidirectionalChat();
    
    console.log('\n🎉 All tests completed! Check the frontend at http://localhost:5174 to see the messages.');
    console.log('💡 Login with:');
    console.log('   User 1: user1@test.com / password123');
    console.log('   User 2: user2@test.com / password123');
    
  } catch (error) {
    console.error('💥 Test execution failed:', error.message);
  }
}

runTests();
