// Serverless-compatible backend entry point for Vercel
import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import messageRouter from "./routes/message.routes.js"

dotenv.config()

const app = express()

// Initialize database connection
let dbConnected = false
const initializeDB = async () => {
  if (!dbConnected) {
    try {
      await connectDB()
      dbConnected = true
      console.log("✅ Database connected for serverless function")
    } catch (error) {
      console.error("❌ Database connection failed:", error)
      throw error
    }
  }
}

// CORS configuration for production
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ["https://alpha-chats.vercel.app", "https://alpha-chats-api.vercel.app"]
    : ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"],
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Alpha-Chats API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  })
})

// API routes
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/message", messageRouter)

// Middleware to ensure DB connection before handling requests
app.use(async (req, res, next) => {
  try {
    await initializeDB()
    next()
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' })
  }
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error)
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  })
})

// Handle 404s
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

export default app
