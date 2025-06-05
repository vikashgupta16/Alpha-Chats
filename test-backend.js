#!/usr/bin/env node

const https = require('https');

const testBackendHealth = () => {
  console.log('🔍 Testing backend deployment health...');
  
  const options = {
    hostname: 'alpha-chats-backend.vercel.app',
    port: 443,
    path: '/api/user/current',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  };

  const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response:', data);
      if (res.statusCode === 404) {
        console.log('❌ Backend returning 404 - needs redeployment');
      } else if (res.statusCode === 401) {
        console.log('✅ Backend working (401 expected for unauthenticated request)');
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error:', error);
  });

  req.end();
};

testBackendHealth();
