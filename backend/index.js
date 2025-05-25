import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import messageRouter from "./routes/messgae.routes.js"

dotenv.config()

const port = process.env.PORT || 5000
const app = express()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/message", messageRouter)


// ✅ Connect to MongoDB FIRST, then start server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`)
    console.log(`🌐 http://localhost:${port}`)
  });
}).catch((err) => {
  console.error("❌ Failed to connect to DB. Server not started.")
});
