// Debug script to check authentication status
console.log('🔍 Checking authentication status...');

// Check if cookies exist
console.log('📄 All cookies:', document.cookie);

// Check localStorage
console.log('💾 localStorage keys:', Object.keys(localStorage));
Object.keys(localStorage).forEach(key => {
    console.log(`  ${key}:`, localStorage.getItem(key));
});

// Check sessionStorage
console.log('🗂️ sessionStorage keys:', Object.keys(sessionStorage));
Object.keys(sessionStorage).forEach(key => {
    console.log(`  ${key}:`, sessionStorage.getItem(key));
});

// Test API call with explicit debugging
async function testAuthenticatedAPI() {
    try {
        console.log('🚀 Testing authenticated API call...');
        
        const response = await fetch('http://localhost:4000/api/user/others', {
            method: 'GET',
            credentials: 'include', // This is critical for cookies
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
        
        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', [...response.headers.entries()]);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API Success:', data.length, 'users');
            console.log('👥 Users:', data);
        } else {
            const errorText = await response.text();
            console.log('❌ API Error:', errorText);
        }
    } catch (error) {
        console.error('❌ API Test failed:', error);
    }
}

// Run the test
testAuthenticatedAPI();
