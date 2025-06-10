// Debug script to check users in browser console
console.log('🔍 DEBUG: Checking users data flow...');

// Check Redux store state
setTimeout(() => {
  try {
    // Try to access Redux store from window
    const store = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__.store;
    if (store) {
      const state = store.getState();
      console.log('📊 Redux State - otherUsers:', state.user?.otherUsers);
      console.log('📊 Redux State - userData:', state.user?.userData);
    } else {
      console.log('🚫 Redux DevTools not available');
    }
    
    // Check if getOtherUsers console logs are appearing
    console.log('👀 Look for [getOtherUsers] logs above to confirm API calls');
    
    // Check current URL and network requests
    console.log('🌐 Current URL:', window.location.href);
    console.log('📡 Check Network tab for /api/user/others requests');
    
  } catch (error) {
    console.error('❌ Debug error:', error);
  }
}, 3000);

// Add a function to manually check users
window.debugCheckUsers = () => {
  console.log('🔍 Manual users check...');
  fetch('http://localhost:4000/api/user/others', {
    credentials: 'include'
  })
  .then(res => res.json())
  .then(data => {
    console.log('✅ Manual API call result:', data);
  })
  .catch(err => {
    console.error('❌ Manual API call failed:', err);
  });
};

console.log('💡 Run debugCheckUsers() to manually test API');
