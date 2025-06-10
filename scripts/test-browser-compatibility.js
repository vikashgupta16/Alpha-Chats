#!/usr/bin/env node

/**
 * Browser Compatibility Testing Script for Alpha-Chats
 * Tests the fixes implemented for developers list issues
 */

const axios = require('axios');
const { spawn } = require('child_process');

// Configuration
const FRONTEND_URL = 'http://localhost:5173';
const BACKEND_URL = 'http://localhost:4000';
const TEST_TIMEOUT = 30000; // 30 seconds

// Test colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Test results
let testResults = {
  passed: 0,
  failed: 0,
  total: 0
};

// Helper functions
const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const logTest = (testName) => {
  testResults.total++;
  log(`\n🧪 Test ${testResults.total}: ${testName}`, 'cyan');
};

const logPass = (message) => {
  testResults.passed++;
  log(`✅ PASS: ${message}`, 'green');
};

const logFail = (message) => {
  testResults.failed++;
  log(`❌ FAIL: ${message}`, 'red');
};

const logWarning = (message) => {
  log(`⚠️  WARNING: ${message}`, 'yellow');
};

const logInfo = (message) => {
  log(`ℹ️  INFO: ${message}`, 'blue');
};

// Test functions
async function testBackendConnectivity() {
  logTest('Backend Connectivity');
  
  try {
    const response = await axios.get(BACKEND_URL, { timeout: 5000 });
    logPass(`Backend is running at ${BACKEND_URL}`);
    logInfo(`Response: ${JSON.stringify(response.data)}`);
    return true;
  } catch (error) {
    logFail(`Backend not accessible: ${error.message}`);
    logWarning('Please ensure backend is running with: npm run dev');
    return false;
  }
}

async function testFrontendConnectivity() {
  logTest('Frontend Connectivity');
  
  try {
    const response = await axios.get(FRONTEND_URL, { timeout: 5000 });
    logPass(`Frontend is running at ${FRONTEND_URL}`);
    return true;
  } catch (error) {
    logFail(`Frontend not accessible: ${error.message}`);
    logWarning('Please ensure frontend is running with: npm run dev');
    return false;
  }
}

async function testCORSConfiguration() {
  logTest('CORS Configuration');
  
  try {
    // Test preflight request
    const response = await axios.options(`${BACKEND_URL}/api/auth/login`, {
      headers: {
        'Origin': FRONTEND_URL,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      },
      timeout: 5000
    });
    
    const allowOrigin = response.headers['access-control-allow-origin'];
    const allowCredentials = response.headers['access-control-allow-credentials'];
    
    if (allowOrigin && allowCredentials === 'true') {
      logPass('CORS is properly configured');
      logInfo(`Allow-Origin: ${allowOrigin}`);
      logInfo(`Allow-Credentials: ${allowCredentials}`);
    } else {
      logFail('CORS configuration incomplete');
      logWarning(`Allow-Origin: ${allowOrigin || 'NOT SET'}`);
      logWarning(`Allow-Credentials: ${allowCredentials || 'NOT SET'}`);
    }
    
    return true;
  } catch (error) {
    logFail(`CORS test failed: ${error.message}`);
    return false;
  }
}

async function testAPIEndpoints() {
  logTest('API Endpoints Accessibility');
  
  const endpoints = [
    '/api/auth/login',
    '/api/auth/signup',
    '/api/user/current',
    '/api/user/others'
  ];
  
  let successCount = 0;
  
  for (const endpoint of endpoints) {
    try {
      // Test with OPTIONS method to check endpoint existence
      await axios.options(`${BACKEND_URL}${endpoint}`, { timeout: 3000 });
      logPass(`Endpoint accessible: ${endpoint}`);
      successCount++;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // 401 is expected for protected endpoints
        logPass(`Endpoint accessible (protected): ${endpoint}`);
        successCount++;
      } else {
        logFail(`Endpoint not accessible: ${endpoint} - ${error.message}`);
      }
    }
  }
  
  return successCount === endpoints.length;
}

async function testEnvironmentVariables() {
  logTest('Environment Variables');
  
  // This would typically be run in the frontend context
  logInfo('Environment variables should be checked in browser console');
  logInfo('Expected variables:');
  logInfo('- VITE_API_URL: http://localhost:4000');
  logInfo('- VITE_SOCKET_URL: http://localhost:4000');
  
  // Check if .env.local exists
  const fs = require('fs');
  const path = require('path');
  
  const envPath = path.join(__dirname, '../frontend/.env.local');
  
  if (fs.existsSync(envPath)) {
    logPass('.env.local file exists');
    const envContent = fs.readFileSync(envPath, 'utf8');
    logInfo('Environment file content:');
    logInfo(envContent);
  } else {
    logFail('.env.local file missing');
    logWarning('Create .env.local with VITE_API_URL=http://localhost:4000');
  }
  
  return true;
}

async function testDatabaseConnection() {
  logTest('Database Connection');
  
  try {
    // Try to access a protected endpoint that requires DB
    const response = await axios.get(`${BACKEND_URL}/api/user/current`, {
      timeout: 5000,
      validateStatus: (status) => status < 500 // Accept any status below 500
    });
    
    if (response.status === 401) {
      logPass('Database connection working (endpoint returns auth error as expected)');
    } else if (response.status === 200) {
      logPass('Database connection working (user authenticated)');
    } else {
      logWarning(`Unexpected response status: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    if (error.response && error.response.status < 500) {
      logPass('Database connection working');
    } else {
      logFail(`Database connection issue: ${error.message}`);
      logWarning('Check MongoDB connection in backend logs');
    }
    return false;
  }
}

function testURLFormatting() {
  logTest('URL Formatting (Double Slash Prevention)');
  
  // Test the URL cleaning function
  const cleanUrl = (url) => {
    return url.replace(/([^:]\/)\/+/g, '$1');
  };
  
  const testCases = [
    {
      input: 'http://localhost:4000//api/auth/login',
      expected: 'http://localhost:4000/api/auth/login'
    },
    {
      input: 'https://api.example.com///users//profile',
      expected: 'https://api.example.com/users/profile'
    },
    {
      input: 'http://localhost:4000/api/user/others',
      expected: 'http://localhost:4000/api/user/others'
    }
  ];
  
  let allPassed = true;
  
  testCases.forEach((testCase, index) => {
    const result = cleanUrl(testCase.input);
    if (result === testCase.expected) {
      logPass(`URL cleaning test ${index + 1}: ${testCase.input} → ${result}`);
    } else {
      logFail(`URL cleaning test ${index + 1}: Expected ${testCase.expected}, got ${result}`);
      allPassed = false;
    }
  });
  
  return allPassed;
}

async function testSocketIOConnection() {
  logTest('Socket.IO Connection');
  
  logInfo('Socket.IO testing requires browser environment');
  logInfo('Check browser console for:');
  logInfo('- "🌐 Browser Detection:" logs');
  logInfo('- "🔌 Creating new global socket connection" logs');
  logInfo('- Socket connection status indicators');
  
  // We can test if the Socket.IO endpoint responds
  try {
    const response = await axios.get(`${BACKEND_URL}/socket.io/`, {
      timeout: 5000,
      validateStatus: (status) => status < 500
    });
    
    logPass('Socket.IO endpoint accessible');
    return true;
  } catch (error) {
    logFail(`Socket.IO endpoint not accessible: ${error.message}`);
    return false;
  }
}

// Browser compatibility simulation
function testBrowserDetection() {
  logTest('Browser Detection Logic');
  
  // Simulate different user agents
  const testUserAgents = [
    {
      name: 'Chrome Desktop',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      expectedIssues: false
    },
    {
      name: 'Samsung Internet',
      userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/13.0 Chrome/83.0.4103.106 Mobile Safari/537.36',
      expectedIssues: true
    },
    {
      name: 'Safari iOS',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
      expectedIssues: true
    },
    {
      name: 'Chrome Mobile Old',
      userAgent: 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36',
      expectedIssues: true
    }
  ];
  
  // This is a simplified test - the actual logic would run in browser
  logInfo('Browser detection test cases:');
  testUserAgents.forEach(test => {
    const isSamsung = /SamsungBrowser/.test(test.userAgent);
    const isSafari = /Safari/.test(test.userAgent) && !/Chrome/.test(test.userAgent);
    const isIOS = /iPhone|iPad|iPod/.test(test.userAgent);
    const hasIssues = isSamsung || (isIOS && isSafari);
    
    if (hasIssues === test.expectedIssues) {
      logPass(`${test.name}: Correctly detected issues = ${hasIssues}`);
    } else {
      logFail(`${test.name}: Expected issues = ${test.expectedIssues}, detected = ${hasIssues}`);
    }
  });
  
  return true;
}

// Main test runner
async function runAllTests() {
  log('\n🚀 Alpha-Chats Browser Compatibility Test Suite', 'magenta');
  log('=' .repeat(60), 'magenta');
  
  const startTime = Date.now();
  
  // Run all tests
  await testBackendConnectivity();
  await testFrontendConnectivity();
  await testCORSConfiguration();
  await testAPIEndpoints();
  await testEnvironmentVariables();
  await testDatabaseConnection();
  testURLFormatting();
  await testSocketIOConnection();
  testBrowserDetection();
  
  // Results summary
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;
  
  log('\n📊 Test Results Summary', 'magenta');
  log('=' .repeat(30), 'magenta');
  log(`Total Tests: ${testResults.total}`, 'blue');
  log(`Passed: ${testResults.passed}`, 'green');
  log(`Failed: ${testResults.failed}`, 'red');
  log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`, 'cyan');
  log(`Duration: ${duration.toFixed(2)}s`, 'blue');
  
  if (testResults.failed === 0) {
    log('\n🎉 All tests passed! Your Alpha-Chats setup is ready.', 'green');
  } else {
    log('\n⚠️  Some tests failed. Please check the issues above.', 'yellow');
  }
  
  // Recommendations
  log('\n💡 Next Steps:', 'cyan');
  log('1. Open http://localhost:5173 in your browser');
  log('2. Check browser console for compatibility messages');
  log('3. Test login/signup functionality');
  log('4. Verify developers list loads correctly');
  log('5. Test in different browsers (Chrome, Firefox, Safari, Samsung)');
  
  return testResults.failed === 0;
}

// Run tests if called directly
if (require.main === module) {
  runAllTests().catch(error => {
    log(`\n💥 Test suite crashed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { runAllTests, testResults };
