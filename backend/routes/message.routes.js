import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"
import { getMessages, sendMessage, uploadFiles, markMessagesAsRead } from "../controllers/message.controller.js"

const messageRouter=express.Router()

messageRouter.post("/send/:reciver",isAuth,upload.single("image"),sendMessage)
messageRouter.get("/get/:reciver",isAuth,getMessages)
messageRouter.post("/upload/:reciver",isAuth,upload.array("files", 5),uploadFiles)
messageRouter.patch("/read/:senderId",isAuth,markMessagesAsRead)

export default messageRouter
