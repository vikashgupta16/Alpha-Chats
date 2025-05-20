import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
dotenv.config()

const port=process.env.PORT || 5000

const app=express()

app.get("/",(req,res)=>{
    res.send("Hello ALpha")
})


app.listen(port,()=>{
    connectDB()
    console.log(`Server is running on port ${port}`)
    console.log(`http://localhost:${port}`)
})