// Debug script for browser console
// Add this to check the current state

console.log('🔍 Alpha-Chats Debug Started');

// Function to check everything
window.debugAlphaChats = function() {
    console.log('\n=== ALPHA-CHATS DEBUG ===');
    
    // Check Redux store
    if (window.store) {
        const state = window.store.getState();
        console.log('📊 Redux State:', {
            userData: state.user?.userData ? {
                id: state.user.userData._id,
                name: state.user.userData.name || state.user.userData.userName
            } : 'Not logged in',
            otherUsersCount: state.user?.otherUsers?.length || 0,
            otherUsers: state.user?.otherUsers?.slice(0, 3).map(u => ({
                id: u._id,
                name: u.name || u.userName
            })) || [],
            selectedUser: state.user?.selectedUser?._id || 'None',
            messagesCount: state.user?.messages?.length || 0
        });
    } else {
        console.log('❌ Redux store not found');
    }
    
    // Check socket manager
    if (window.socketManager) {
        const status = window.socketManager.getStatus();
        console.log('🔌 Socket Manager:', {
            isConnected: status.isConnected,
            userId: status.userId,
            onlineUsersCount: status.onlineUsers?.length || 0,
            onlineUsers: status.onlineUsers?.slice(0, 5) || [],
            socketId: window.socketManager.socket?.id
        });
    } else {
        console.log('❌ Socket manager not found');
    }
    
    // Check if we're on the right page
    console.log('🌐 Current page:', window.location.pathname);
    
    // Check for any errors in the console
    console.log('📋 To see any errors, check the Network tab and Console for red errors');
    
    console.log('=== END DEBUG ===\n');
    
    return {
        redux: window.store?.getState(),
        socket: window.socketManager?.getStatus(),
        url: window.location.href
    };
};

// Auto-run after page loads
setTimeout(() => {
    console.log('🚀 Auto-running debug check...');
    if (typeof window.debugAlphaChats === 'function') {
        window.debugAlphaChats();
    }
}, 2000);

console.log('✅ Debug script loaded. Run window.debugAlphaChats() to check state.');
