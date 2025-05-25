import uplodOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/connversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
    try {
        let sender = req.userId;
        let { reciver } = req.params;
        let { message } = req.body;

        let image;
        if(req.file){
            image=await uplodOnCloudinary(req.file.path)
        }

        let conversastion=await Conversation.findOne({
            participants:{$all:[sender, reciver]}
        })
        
        let newMessage=await Message.create({
            sender, reciver, message,image
        })

        if(!conversastion){
            conversastion=await Conversation.create({
                participants:[sender, reciver],
                messages:[newMessage._id]
            })
        }else{
            conversastion.messages.push(newMessage._id);
            await conversastion.save();
        }

        return res.status(201).json(newMessage)

    } catch (error) {
        return res.status(500).json({message: "Internal Server Error", error: error.message});
    }
}

export const getMessages = async (req, res) => {
    try {
        let sender = req.userId;
        let { reciver } = req.params;
        let conversastion=await Conversation.findOne({
            participants:{$all:[sender, reciver]}
        }).populate("messages")
        if(!conversastion){
            return res.status(404).json({message: "Conversation not found"});
        }

        return res.status(200).json(conversastion?.messages);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}