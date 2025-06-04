import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'

const useSocket = (onMessageReceived) => {
  const socketRef = useRef(null)
  const { userData } = useSelector(state => state.user)
  const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000"
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [typingUsers, setTypingUsers] = useState(new Set())
  // Use ref to store the callback to avoid dependency issues
  const onMessageReceivedRef = useRef(onMessageReceived)
  
  useEffect(() => {
    onMessageReceivedRef.current = onMessageReceived
  }, [onMessageReceived])

  useEffect(() => {
    if (userData?._id) {
      // Initialize socket connection
      socketRef.current = io(socketUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling']
      })

      const socket = socketRef.current

      // Connection events
      socket.on('connect', () => {
        console.log('🔌 Connected to server')
        setIsConnected(true)
        // Join user to their room
        socket.emit('join', userData._id)
      })

      socket.on('disconnect', () => {
        console.log('❌ Disconnected from server')
        setIsConnected(false)
      })

      // User presence events
      socket.on('onlineUsers', (data) => {
        if (data && typeof data === 'object' && data.users) {
          setOnlineUsers(data.users)
          console.log('👥 Online users updated:', data.count)
        } else if (Array.isArray(data)) {
          // Legacy support
          setOnlineUsers(data)
        }
      })

      socket.on('userStatusUpdate', (data) => {
        console.log('📱 User status update:', data)
        // You can dispatch this to Redux if needed
      })

      // Message events
      socket.on('newMessage', (message) => {
        console.log('📩 New message received:', message)
        if (onMessageReceivedRef.current) {
          onMessageReceivedRef.current(message)
        }
      })

      // Legacy message events for backward compatibility
      socket.on('new-message', (message) => {
        if (onMessageReceivedRef.current) {
          onMessageReceivedRef.current(message)
        }
      })

      socket.on('receive-message', (message) => {
        if (onMessageReceivedRef.current) {
          onMessageReceivedRef.current(message)
        }
      })

      // Message status events
      socket.on('messageDelivered', (data) => {
        console.log('✅ Message delivered:', data)
      })

      socket.on('messageSent', (data) => {
        console.log('📤 Message sent:', data)
      })

      socket.on('messageError', (error) => {
        console.error('❌ Message error:', error)
      })

      socket.on('messageRead', (data) => {
        console.log('👁️ Message read:', data)
      })

      // Typing indicators
      socket.on('userTyping', (data) => {
        if (data.isTyping) {
          setTypingUsers(prev => new Set([...prev, data.userId]))
        } else {
          setTypingUsers(prev => {
            const newSet = new Set(prev)
            newSet.delete(data.userId)
            return newSet
          })
        }
        console.log('⌨️ User typing:', data)
      })

      socket.on('userStoppedTyping', (data) => {
        setTypingUsers(prev => {
          const newSet = new Set(prev)
          newSet.delete(data.userId)
          return newSet
        })
      })

      // User activity events
      socket.on('userActivityUpdate', (data) => {
        console.log('📊 User activity:', data)
      })

      // Error handling
      socket.on('connect_error', (error) => {
        console.error('❌ Connection error:', error)
        setIsConnected(false)
      })

      return () => {
        console.log('🔌 Disconnecting socket')
        socket.disconnect()
        socketRef.current = null
        setIsConnected(false)
      }
    }
  }, [userData?._id, socketUrl])

  // Send message function
  const sendMessage = (messageData) => {
    if (socketRef.current && isConnected) {
      const enhancedData = {
        ...messageData,
        senderId: userData._id,
        messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date()
      }
      
      console.log('📤 Sending message:', enhancedData)
      socketRef.current.emit('sendMessage', enhancedData)
      return enhancedData.messageId
    } else {
      console.warn('⚠️ Socket not connected, cannot send message')
      return null
    }
  }

  // Typing indicator functions
  const startTyping = (recipientId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('typing', {
        senderId: userData._id,
        recipientId,
        isTyping: true
      })
    }
  }

  const stopTyping = (recipientId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('typing', {
        senderId: userData._id,
        recipientId,
        isTyping: false
      })
    }
  }

  // Update user status
  const updateStatus = (status) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('updateStatus', {
        userId: userData._id,
        status
      })
    }
  }
  // Mark messages as read for a conversation
  const markAsRead = (senderId) => {
    if (socketRef.current && isConnected && userData?._id) {
      socketRef.current.emit('markConversationAsRead', {
        senderId,
        recipientId: userData._id
      })
      console.log('📖 Marking conversation as read:', { senderId, recipientId: userData._id })
    }
  }

  // Join/leave rooms
  const joinRoom = (roomId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('joinRoom', roomId)
    }
  }

  const leaveRoom = (roomId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('leaveRoom', roomId)
    }
  }

  // Get user activity
  const getUserActivity = (userId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('getUserActivity', userId)
    }
  }

  return { 
    sendMessage,
    startTyping,
    stopTyping,
    updateStatus,
    markAsRead,
    joinRoom,
    leaveRoom,
    getUserActivity,
    isConnected,
    onlineUsers,
    typingUsers: Array.from(typingUsers)
  }
}

export default useSocket
