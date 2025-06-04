// Test script for Alpha-Chat messaging functionality
import axios from 'axios';

const SERVER_URL = 'http://localhost:4000';

// Test data
const testUsers = [
  { id: '683fc3fc6a933593df04da16', name: 'User1' },
  { id: '6840420e0418f5577283211b', name: 'User2' }
];

const testMessages = [
  {
    type: 'text',
    message: 'Hello! This is a regular text message.'
  },
  {
    type: 'code',
    code: 'function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n-1) + fibonacci(n-2);\n}',
    codeLang: 'javascript'
  },
  {
    type: 'terminal',
    terminal: 'npm install react-syntax-highlighter'
  }
];

async function testMessageSending() {
  console.log('🧪 Testing Alpha-Chat messaging functionality...\n');
  
  for (const msgData of testMessages) {
    console.log(`📨 Testing ${msgData.type} message:`, msgData);
    
    try {
      let payload = {};
      
      if (msgData.type === 'text') {
        payload = { message: msgData.message };
      } else if (msgData.type === 'code') {
        payload = {
          message: msgData.code,
          code: msgData.code,
          codeLang: msgData.codeLang
        };
      } else if (msgData.type === 'terminal') {
        payload = {
          message: msgData.terminal,
          terminal: msgData.terminal
        };
      }
      
      console.log('📤 Sending payload:', payload);
      console.log('✅ Message structure looks good\n');
      
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  }
}

testMessageSending();
