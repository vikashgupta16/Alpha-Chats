// Global socket manager - prevents multiple socket connections
import { io } from 'socket.io-client'

class SocketManager {
  constructor() {
    this.socket = null
    this.isConnected = false
    this.userId = null
    this.callbacks = new Set()
    this.onlineUsers = []
    this.typingUsers = new Set()
  }

  // Initialize socket connection (only once per user session)
  init(userId, socketUrl) {
    if (this.socket && this.userId === userId) {
      console.log('✅ Socket already initialized for user:', userId)
      return this.socket
    }

    if (this.socket) {
      console.log('🔄 Cleaning up existing socket for different user')
      this.cleanup()
    }

    console.log('🔌 Creating new global socket connection for user:', userId)
    this.userId = userId
    
    this.socket = io(socketUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    })

    this.setupEventListeners()
    return this.socket
  }

  setupEventListeners() {
    this.socket.on('connect', () => {
      console.log('✅ Global socket connected')
      this.isConnected = true
      this.socket.emit('join', this.userId)
      this.notifyCallbacks('connect')
    })

    this.socket.on('disconnect', () => {
      console.log('❌ Global socket disconnected')
      this.isConnected = false
      this.notifyCallbacks('disconnect')
    })

    this.socket.on('onlineUsers', (data) => {
      if (data && typeof data === 'object' && data.users) {
        this.onlineUsers = data.users
      } else if (Array.isArray(data)) {
        this.onlineUsers = data
      }
      this.notifyCallbacks('onlineUsers', this.onlineUsers)
    })

    this.socket.on('newMessage', (message) => {
      console.log('📩 Global socket received message:', message)
      this.notifyCallbacks('newMessage', message)
    })

    // Add other event listeners...
    this.socket.on('userTyping', (data) => {
      if (data.isTyping) {
        this.typingUsers.add(data.userId)
      } else {
        this.typingUsers.delete(data.userId)
      }
      this.notifyCallbacks('userTyping', data)
    })
  }

  // Register callback for events
  subscribe(callback) {
    this.callbacks.add(callback)
    return () => this.callbacks.delete(callback)
  }

  // Notify all registered callbacks
  notifyCallbacks(event, data) {
    this.callbacks.forEach(callback => {
      if (typeof callback === 'function') {
        callback(event, data)
      }
    })
  }

  // Send message
  sendMessage(messageData, currentUserId) {
    if (this.socket && this.isConnected) {
      const enhancedData = {
        ...messageData,
        senderId: currentUserId,
        messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date()
      }
      
      this.socket.emit('sendMessage', enhancedData)
      return enhancedData.messageId
    } else {
      console.warn('Global socket not connected, cannot send message')
      return null
    }
  }

  // Cleanup socket
  cleanup() {
    if (this.socket) {
      console.log('🚪 Cleaning up global socket')
      this.socket.removeAllListeners()
      this.socket.disconnect()
      this.socket = null
      this.userId = null
      this.isConnected = false
      this.onlineUsers = []
      this.typingUsers.clear()
      this.callbacks.clear()
    }
  }

  // Get current status
  getStatus() {
    return {
      isConnected: this.isConnected,
      onlineUsers: this.onlineUsers,
      typingUsers: Array.from(this.typingUsers),
      userId: this.userId
    }
  }
}

// Export singleton instance
export const socketManager = new SocketManager()
