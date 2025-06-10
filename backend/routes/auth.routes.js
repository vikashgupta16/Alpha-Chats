import express from "express"
import {login, logout, signUp} from '../controllers/auth.controllers.js'

const authRouter=express.Router()

// Health check endpoint (no auth required)
authRouter.get("/health", (req, res) => {
    res.json({ 
        status: "ok", 
        timestamp: new Date().toISOString(),
        cookies: req.cookies,
        headers: req.headers
    })
})

authRouter.post("/signup",signUp)
authRouter.post("/login",login)
authRouter.get("/logout",logout)

export default authRouter