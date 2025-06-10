// Debug utility to trace online users data flow
export const debugOnlineUsersFlow = () => {
    console.log('\n🔍 === ONLINE USERS DEBUG FLOW ===');
    
    // Check if socketManager exists
    if (window.socketManager) {
        const status = window.socketManager.getStatus();
        console.log('📊 SocketManager Status:', {
            isConnected: status.isConnected,
            onlineUsersCount: status.onlineUsers?.length || 0,
            onlineUsersArray: status.onlineUsers,
            userId: status.userId,
            socketId: window.socketManager.socket?.id
        });
        
        // Check raw socket events
        if (window.socketManager.socket) {
            console.log('🔌 Socket Info:', {
                connected: window.socketManager.socket.connected,
                id: window.socketManager.socket.id,
                transport: window.socketManager.socket.io.engine?.transport?.name
            });
        }
    } else {
        console.log('❌ SocketManager not found on window object');
    }
    
    // Check Redux state via window store
    try {
        const store = window.store || (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__.getState());
        if (store) {
            const state = store.getState ? store.getState() : store;
            console.log('📊 Redux State:', {
                userData: state.user?.userData?._id || 'Not logged in',
                otherUsersCount: state.user?.otherUsers?.length || 0,
                otherUsers: state.user?.otherUsers?.map(u => u._id) || [],
                selectedUser: state.user?.selectedUser?._id || 'None'
            });
        } else {
            console.log('❌ Redux store not accessible');
        }
    } catch (error) {
        console.log('❌ Error accessing Redux:', error.message);
    }
    
    console.log('=== END DEBUG FLOW ===\n');
    
    // Return current status for inspection
    return {
        socketManager: window.socketManager?.getStatus(),
        timestamp: new Date().toISOString()
    };
};

// Manual trigger for debugging
export const testSocketEvents = () => {
    console.log('🧪 Testing Socket Events...');
    
    if (window.socketManager?.socket) {
        const socket = window.socketManager.socket;
        
        // Listen for the next onlineUsers event
        socket.once('onlineUsers', (data) => {
            console.log('📡 Received onlineUsers event:', data);
            console.log('📡 Event type:', typeof data);
            console.log('📡 Is array:', Array.isArray(data));
            if (data && typeof data === 'object') {
                console.log('📡 Data keys:', Object.keys(data));
            }
        });
        
        // Force request online users
        socket.emit('requestOnlineUsers');
        console.log('📤 Requested online users from server');
    } else {
        console.log('❌ No socket available for testing');
    }
};

// Auto-run debug every 5 seconds when in development
if (import.meta.env.DEV) {
    window.debugOnlineUsersFlow = debugOnlineUsersFlow;
    window.testSocketEvents = testSocketEvents;
    
    // Auto debug interval (reduced frequency)
    let debugInterval;
    
    const startAutoDebug = () => {
        if (debugInterval) clearInterval(debugInterval);
        debugInterval = setInterval(() => {
            if (window.location.pathname === '/') { // Only on home page
                debugOnlineUsersFlow();
            }
        }, 10000); // Every 10 seconds
    };
    
    // Start auto debug after a delay to let everything initialize
    setTimeout(startAutoDebug, 3000);
    
    console.log('🛠️ Debug tools loaded! Use window.debugOnlineUsersFlow() or window.testSocketEvents()');
}
