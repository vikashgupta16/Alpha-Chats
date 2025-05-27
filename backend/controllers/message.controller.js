import uplodOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
    try {
        let sender = req.userId;
        let { receiver } = req.params;
        let { message } = req.body;

        let image;
        if(req.file){
            image=await uplodOnCloudinary(req.file.path)
        }

        let conversation=await Conversation.findOne({
            participants:{$all:[sender, receiver]}
        })
          let newMessage=await Message.create({
            sender, receiver, message,image
        })
        
        if(!conversation){
            conversation=await Conversation.create({
                participants:[sender, receiver],
                messages:[newMessage._id]
            })
        }else{
            conversation.messages.push(newMessage._id);
            await conversation.save();
        }

        // Emit real-time message to receiver via Socket.io
        const io = req.app.get('socketio')
        if (io) {
            io.emit('new-message', {
                ...newMessage.toObject(),
                receiver
            })
        }

        return res.status(201).json(newMessage)

    } catch (error) {
        return res.status(500).json({message: "Internal Server Error", error: error.message});
    }
}

export const getMessages = async (req, res) => {
    try {
        let sender = req.userId;
        let { receiver } = req.params;
        let conversation=await Conversation.findOne({
            participants:{$all:[sender, receiver]}
        }).populate("messages")
        if(!conversation){
            return res.status(404).json({message: "Conversation not found"});
        }

        return res.status(200).json(conversation?.messages);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}