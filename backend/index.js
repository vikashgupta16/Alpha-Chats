import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import messageRouter from "./routes/message.routes.js"
import { createServer } from "http"
import { Server } from "socket.io"

dotenv.config()

const port = process.env.PORT || 5000
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173"
const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    credentials: true
  }
})

// Store user socket connections
const userSocketMap = {}

io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`)
  
  socket.on('user-login', (userId) => {
    userSocketMap[userId] = socket.id
    console.log(`📝 User ${userId} mapped to socket ${socket.id}`)
  })
  
  socket.on('send-message', (data) => {
    const receiverSocketId = userSocketMap[data.receiver]
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit('receive-message', data)
    }
  })
  
  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`)
    // Remove user from socket map
    for (const [userId, socketId] of Object.entries(userSocketMap)) {
      if (socketId === socket.id) {
        delete userSocketMap[userId]
        break
      }
    }
  })
})

app.use(cors({
  origin: corsOrigin,
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// Make socket.io available to controllers
app.set('socketio', io)

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
