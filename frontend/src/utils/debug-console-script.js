// Browser console debugging script
// Copy and paste this into the browser console to debug the online users issue

console.log('🔍 Starting Alpha-Chats Debug Session...');

// Function to check everything
function debugEverything() {
    console.log('\n=== COMPLETE DEBUG SESSION ===');
    
    // 1. Check if we're logged in
    console.log('1. User Authentication:');
    if (window.store) {
        const state = window.store.getState();
        console.log('   - Logged in:', !!state.user.userData);
        console.log('   - User ID:', state.user.userData?._id);
        console.log('   - Other users count:', state.user.otherUsers?.length || 0);
    }
    
    // 2. Check socket connection
    console.log('\n2. Socket Connection:');
    if (window.socketManager) {
        const status = window.socketManager.getStatus();
        console.log('   - Connected:', status.isConnected);
        console.log('   - Socket ID:', window.socketManager.socket?.id);
        console.log('   - Online users from socket:', status.onlineUsers?.length || 0);
        console.log('   - Online users array:', status.onlineUsers);
    } else {
        console.log('   - ❌ socketManager not found');
    }
    
    // 3. Check if socket events are being received
    console.log('\n3. Socket Event Test:');
    if (window.socketManager?.socket) {
        // Add a one-time listener for the next onlineUsers event
        window.socketManager.socket.once('onlineUsers', (data) => {
            console.log('   - ✅ Received onlineUsers event:', data);
        });
        
        // Request fresh data
        window.socketManager.socket.emit('requestOnlineUsers');
        console.log('   - 📤 Requested fresh online users data');
    }
    
    // 4. Check SideBar props
    console.log('\n4. SideBar Component:');
    const sidebar = document.querySelector('[data-testid="sidebar"]');
    if (sidebar) {
        console.log('   - SideBar found in DOM');
    } else {
        console.log('   - 📊 Check React DevTools for SideBar props');
    }
    
    console.log('\n=== END DEBUG SESSION ===\n');
}

// Run the debug
debugEverything();

// Set up monitoring
console.log('Setting up 10-second monitoring...');
const monitorInterval = setInterval(() => {
    console.log('\n📊 Monitor Update:');
    if (window.socketManager) {
        const status = window.socketManager.getStatus();
        console.log('Socket connected:', status.isConnected, '| Online users:', status.onlineUsers?.length || 0);
    }
    if (window.store) {
        const state = window.store.getState();
        console.log('Redux other users:', state.user.otherUsers?.length || 0);
    }
}, 10000);

// Clean up function
window.stopMonitoring = () => {
    clearInterval(monitorInterval);
    console.log('Monitoring stopped');
};

console.log('✅ Debug setup complete! Run stopMonitoring() to stop the monitor.');