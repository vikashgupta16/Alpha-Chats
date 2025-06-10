// Real-time debugging in Simple Browser
// Run this in the browser console to debug authentication

// 1. Check current authentication state
console.log('🔍 === AUTHENTICATION DEBUG ===');
console.log('Current URL:', window.location.href);
console.log('Domain:', window.location.hostname);
console.log('Port:', window.location.port);
console.log('Protocol:', window.location.protocol);

// 2. Check cookies
console.log('\n📄 === COOKIES ===');
console.log('All cookies:', document.cookie);
console.log('Cookie split:', document.cookie.split(';').map(c => c.trim()));

// 3. Check storage
console.log('\n💾 === STORAGE ===');
console.log('localStorage:', { ...localStorage });
console.log('sessionStorage:', { ...sessionStorage });

// 4. Test different API calls
async function runDebugTests() {
    console.log('\n🧪 === API TESTS ===');
    
    // Test 1: Basic fetch with credentials
    try {
        console.log('Test 1: Basic fetch...');
        const res1 = await fetch('http://localhost:4000/api/user/others', {
            method: 'GET',
            credentials: 'include'
        });
        console.log('✓ Basic fetch status:', res1.status);
        if (res1.status === 200) {
            const data = await res1.json();
            console.log('✓ Users fetched:', data.length);
        } else {
            console.log('✗ Error:', await res1.text());
        }
    } catch (e) {
        console.log('✗ Basic fetch failed:', e.message);
    }
    
    // Test 2: Axios call
    try {
        console.log('\nTest 2: Axios call...');
        const res2 = await axios.get('http://localhost:4000/api/user/others', {
            withCredentials: true
        });
        console.log('✓ Axios status:', res2.status);
        console.log('✓ Axios users:', res2.data.length);
    } catch (e) {
        console.log('✗ Axios failed:', e.response?.status, e.response?.data || e.message);
    }
    
    // Test 3: Check backend directly
    try {
        console.log('\nTest 3: Backend health check...');
        const res3 = await fetch('http://localhost:4000/api/auth/health', {
            method: 'GET',
            credentials: 'include'
        });
        console.log('✓ Backend health:', res3.status);
    } catch (e) {
        console.log('✗ Backend unreachable:', e.message);
    }
}

runDebugTests();

// 5. Manual cookie test
console.log('\n🍪 === MANUAL COOKIE TEST ===');
document.cookie = "test-cookie=test-value; path=/; domain=localhost";
console.log('Set test cookie, current cookies:', document.cookie);
