import express from "express"
import { editProfile, getCurrentUser, getOtherUser } from "../controllers/user.controller.js"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"

const userRouter=express.Router()

userRouter.get("/current",isAuth,getCurrentUser)
userRouter.get("/others",isAuth,getOtherUser)

// Profile update route with enhanced error handling
userRouter.put("/profile", isAuth, (req, res, next) => {
    upload.single("image")(req, res, (err) => {
        if (err) {
            console.error('❌ Multer error:', err.message);
            
            // Handle specific multer errors
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    message: "File too large. Maximum size is 5MB."
                });
            }
            
            if (err.message.includes('Only image files are allowed')) {
                return res.status(400).json({
                    message: "Invalid file type. Only image files are allowed (jpeg, jpg, png, gif, webp)."
                });
            }
            
            return res.status(400).json({
                message: "File upload error: " + err.message
            });
        }
        
        // If no error, continue to the controller
        next();
    });
}, editProfile);

export default userRouter