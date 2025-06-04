import express from "express"
import { editProfile, getCurrentUser, getOtherUser } from "../controllers/user.controller.js"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"

const userRouter=express.Router()

userRouter.get("/current",isAuth,getCurrentUser)
userRouter.get("/others",isAuth,getOtherUser)
userRouter.put("/profile",isAuth,upload.single("image"),editProfile)
export default userRouter