import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import messageRouter from "./routes/messgae.routes.js"
import { Server } from "socket.io"
import http from "http"
import Message from "./models/message.model.js"
import Conversation from "./models/connversation.model.js"

dotenv.config()

const port = process.env.PORT || 4000
const app = express()
const server = http.createServer(app)

// Initialize Socket.io with CORS settings
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [
          "https://*.vercel.app",
          "https://alpha-chats.vercel.app/",
          "https://*.netlify.app",
          "https://*.up.railway.app",
          process.env.FRONTEND_URL,
          /vercel\.app$/,
          /netlify\.app$/,
          /railway\.app$/
        ] 
      : ["http://localhost:5173", "https://alpha-chats.vercel.app/", "http://localhost:5174", "http://localhost:5175"],
    methods: ["GET", "POST"],
    credentials: true
  }
})

// Store online users with enhanced tracking
const onlineUsers = new Map()
const typingUsers = new Map() // Track typing status
const userActivity = new Map() // Track user activity

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`)

  // Handle user joining/login
  socket.on('join', (userId) => {
    onlineUsers.set(userId, {
      socketId: socket.id,
      status: 'online',
      lastSeen: new Date(),
      joinedAt: new Date()
    })
    
    // Initialize activity tracking
    userActivity.set(userId, {
      messagesSent: 0,
      sessionStart: new Date(),
      lastActivity: new Date()
    })
    
    // Broadcast updated online users list to all clients
    io.emit('onlineUsers', {
      users: Array.from(onlineUsers.keys()),
      count: onlineUsers.size,
      timestamp: new Date()
    })
    
    // Send user status update
    socket.broadcast.emit('userStatusUpdate', {
      userId,
      status: 'online',
      timestamp: new Date()
    })
    
    console.log(`✅ User ${userId} joined. Online users: ${onlineUsers.size}`)
  })

  // Enhanced user login event (legacy support)
  socket.on('user-login', (userId) => {
    socket.emit('join', userId)
  })
  // Handle sending messages with enhanced features
  socket.on('sendMessage', async (data) => {
    try {
      console.log('📩 Received message data:', JSON.stringify(data, null, 2));
      
      const { senderId, recipientId, message, type = 'text', metadata = {} } = data
      
      // Update user activity
      if (userActivity.has(senderId)) {
        const activity = userActivity.get(senderId)
        activity.messagesSent++
        activity.lastActivity = new Date()
        userActivity.set(senderId, activity)
      }
      
      // Enhanced message data based on type
      let messageContent = message || ''
      let enhancedMetadata = { ...metadata }
      
      if (type === 'code') {
        enhancedMetadata = {
          ...enhancedMetadata,
          language: data.codeLang || metadata.language || 'javascript',
          code: data.code || message
        }
        messageContent = data.code || message
      } else if (type === 'terminal') {
        enhancedMetadata = {
          ...enhancedMetadata,
          terminal: data.terminal || message,
          command: data.command || data.terminal || message
        }
        messageContent = data.terminal || message
      }
      
      // Save message to database
      const newMessage = await Message.create({
        sender: senderId,
        reciver: recipientId,
        message: messageContent,
        messageType: type,
        files: enhancedMetadata.files || []
      })

      // Update or create conversation
      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, recipientId] }
      })

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, recipientId],
          messages: [newMessage._id]
        })
      } else {
        // Ensure messages is an array (handle old schema)
        if (!Array.isArray(conversation.messages)) {
          conversation.messages = conversation.messages ? [conversation.messages] : []
        }
        conversation.messages.push(newMessage._id)
        conversation.lastMessage = new Date()
        await conversation.save()
      }

      // Find recipient's socket and delivery status
      const recipient = Array.from(onlineUsers.entries())
        .find(([userId, userData]) => userId === recipientId)
      
      const messageData = {
        _id: newMessage._id,
        messageId: data.messageId,
        senderId,
        recipientId,
        message: messageContent,
        type,
        metadata: enhancedMetadata,
        timestamp: newMessage.createdAt,
        delivered: !!recipient,
        read: false
      }
      
      // Clear typing status for sender
      if (typingUsers.has(senderId)) {
        typingUsers.delete(senderId)
        socket.broadcast.emit('userStoppedTyping', { userId: senderId })
      }
      
      if (recipient) {
        const [userId, userData] = recipient
        // Send message to recipient
        io.to(userData.socketId).emit('newMessage', messageData)
        io.to(userData.socketId).emit('new-message', messageData) // Legacy support
        io.to(userData.socketId).emit('receive-message', messageData) // Legacy support
        
        // Send delivery confirmation to sender
        socket.emit('messageDelivered', {
          messageId: data.messageId,
          recipientId,
          timestamp: new Date(),
          dbId: newMessage._id,
          status: 'delivered'
        })
        
        console.log(`📩 Message delivered: ${senderId} → ${recipientId}`)
      } else {
        // User is offline, message saved but not delivered
        socket.emit('messageStatus', {
          messageId: data.messageId,
          status: 'offline',
          recipientId,
          dbId: newMessage._id
        })
        
        console.log(`📱 Message queued for offline user: ${senderId} → ${recipientId}`)
      }
      
      // Broadcast to sender as well (for multi-device sync)
      socket.emit('messageSent', {
        ...messageData,
        status: recipient ? 'delivered' : 'queued'
      })
      
    } catch (error) {
      console.error('Error saving message:', error)
      socket.emit('messageError', {
        messageId: data.messageId,
        error: 'Failed to save message',
        details: error.message
      })
    }
  })

  // Legacy send-message support
  socket.on('send-message', (data) => {
    socket.emit('sendMessage', data)
  })

  // Enhanced typing indicators
  socket.on('typing', (data) => {
    const { recipientId, isTyping, senderId } = data
    
    if (isTyping) {
      typingUsers.set(senderId, {
        recipientId,
        startTime: new Date()
      })
    } else {
      typingUsers.delete(senderId)
    }
    
    const recipient = Array.from(onlineUsers.entries())
      .find(([userId, userData]) => userId === recipientId)
    
    if (recipient) {
      const [userId, userData] = recipient
      io.to(userData.socketId).emit('userTyping', {
        userId: senderId,
        isTyping,
        timestamp: new Date()
      })
    }
  })

  // Handle user status updates
  socket.on('updateStatus', (data) => {
    const { userId, status } = data
    if (onlineUsers.has(userId)) {
      onlineUsers.get(userId).status = status
      onlineUsers.get(userId).lastSeen = new Date()
      
      // Broadcast status update
      io.emit('userStatusUpdate', { 
        userId, 
        status, 
        timestamp: new Date() 
      })
    }
  })

  // Handle joining specific rooms/conversations
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId)
    console.log(`👥 User ${socket.id} joined room: ${roomId}`)
  })

  // Handle leaving rooms
  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId)
    console.log(`👋 User ${socket.id} left room: ${roomId}`)
  })

  // Handle file sharing
  socket.on('shareFile', (data) => {
    const { recipientId, fileData } = data
    const recipient = Array.from(onlineUsers.entries())
      .find(([userId, userData]) => userId === recipientId)
    
    if (recipient) {
      const [userId, userData] = recipient
      io.to(userData.socketId).emit('fileReceived', {
        ...fileData,
        senderId: data.senderId,
        timestamp: new Date()
      })
    }
  })

  // Handle message read receipts
  socket.on('markAsRead', (data) => {
    const { messageId, senderId, recipientId } = data
    
    // Notify sender that message was read
    const sender = Array.from(onlineUsers.entries())
      .find(([userId, userData]) => userId === senderId)
    
    if (sender) {
      const [userId, userData] = sender
      io.to(userData.socketId).emit('messageRead', {
        messageId,
        readBy: recipientId,
        timestamp: new Date()
      })
    }
  })

  // Get user activity stats
  socket.on('getUserActivity', (userId) => {
    const activity = userActivity.get(userId)
    const userStatus = onlineUsers.get(userId)
    
    socket.emit('userActivityUpdate', {
      userId,
      activity: activity || null,
      status: userStatus || null,
      timestamp: new Date()
    })
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    // Find and remove user from online users
    const userEntry = Array.from(onlineUsers.entries())
      .find(([userId, userData]) => userData.socketId === socket.id)
    
    if (userEntry) {
      const [userId] = userEntry
      
      // Update last seen time
      onlineUsers.get(userId).lastSeen = new Date()
      onlineUsers.get(userId).status = 'offline'
      
      // Clean up typing status
      typingUsers.delete(userId)
      
      // Remove from online users
      onlineUsers.delete(userId)
      
      // Broadcast updated online users list
      io.emit('onlineUsers', {
        users: Array.from(onlineUsers.keys()),
        count: onlineUsers.size,
        timestamp: new Date()
      })
      
      // Broadcast user offline status
      socket.broadcast.emit('userStatusUpdate', {
        userId,
        status: 'offline',
        timestamp: new Date()
      })
      
      console.log(`❌ User ${userId} disconnected. Online users: ${onlineUsers.size}`)
    }
  })
})

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        "https://*.vercel.app", 
        "https://*.netlify.app",
        "https://*.up.railway.app",
        process.env.FRONTEND_URL,
        /vercel\.app$/,
        /netlify\.app$/,
        /railway\.app$/
      ] 
    : ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"],
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io
  req.onlineUsers = onlineUsers
  req.userActivity = userActivity
  next()
})

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/message", messageRouter)

// ✅ Connect to MongoDB FIRST, then start server
connectDB().then(() => {
  server.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`)
    console.log(`🌐 http://localhost:${port}`)
    console.log(`🔌 Socket.io server ready`)
  });
}).catch((err) => {
  console.error("❌ Failed to connect to DB. Server not started.")
});
