import uplodOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
    try {
        console.log('📨 Received message request:', {
            body: req.body,
            params: req.params,
            userId: req.userId
        });
        
        let sender = req.userId;
        let { reciver } = req.params;
        let { message, code, codeLang, terminal } = req.body;

        let image;
        if(req.file){
            image=await uplodOnCloudinary(req.file.path)
        }

        // Determine message type and content
        let messageType = 'text';
        let messageContent = message;
        let metadata = {};

        if (code && codeLang) {
            messageType = 'code';
            messageContent = code;
            metadata = { language: codeLang };
            console.log('🖥️ Code message detected:', { language: codeLang, codeLength: code.length });
        } else if (terminal) {
            messageType = 'terminal';
            messageContent = terminal;
            metadata = { command: terminal };
            console.log('⚡ Terminal message detected:', { command: terminal });
        } else {
            console.log('💬 Text message detected');
        }

        let conversastion=await Conversation.findOne({
            participants:{$all:[sender, reciver]}
        })
        
        let newMessage=await Message.create({
            sender, 
            reciver, 
            message: messageContent,
            messageType,
            metadata,
            image
        })

        console.log('✅ Message created:', {
            id: newMessage._id,
            type: messageType,
            contentLength: messageContent?.length || 0
        });

        if(!conversastion){
            conversastion=await Conversation.create({
                participants:[sender, reciver],
                messages:[newMessage._id]
            })
            console.log('📁 New conversation created');
        }else{
            conversastion.messages.push(newMessage._id);
            await conversastion.save();
            console.log('📁 Message added to existing conversation');
        }

        return res.status(201).json(newMessage)

    } catch (error) {
        console.error('❌ Error in sendMessage:', error);
        return res.status(500).json({message: "Internal Server Error", error: error.message});
    }
}

export const getMessages = async (req, res) => {
    try {
        console.log('📥 Getting messages for conversation:', {
            sender: req.userId,
            receiver: req.params.reciver
        });
        
        let sender = req.userId;
        let { reciver } = req.params;
        let conversastion=await Conversation.findOne({
            participants:{$all:[sender, reciver]}
        }).populate("messages")
        
        if(!conversastion){
            console.log('📭 No conversation found, returning empty array');
            return res.status(200).json([]);
        }

        console.log('📬 Found conversation with messages:', conversastion.messages?.length || 0);
        return res.status(200).json(conversastion?.messages || []);
    } catch (error) {
        console.error('❌ Error in getMessages:', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const uploadFiles = async (req, res) => {
    try {
        let sender = req.userId;
        let { reciver } = req.params;
        
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        const fileUrls = [];
        
        // Upload each file to cloudinary
        for (const file of req.files) {
            try {
                const uploadResult = await uplodOnCloudinary(file.path);
                fileUrls.push({
                    name: file.originalname,
                    url: uploadResult,
                    size: file.size,
                    type: file.mimetype
                });
            } catch (uploadError) {
                console.error('File upload error:', uploadError);
            }
        }

        if (fileUrls.length === 0) {
            return res.status(500).json({ message: "Failed to upload files" });
        }

        // Create message with file attachments
        let conversastion = await Conversation.findOne({
            participants: { $all: [sender, reciver] }
        });
        
        let newMessage = await Message.create({
            sender, 
            reciver, 
            message: `Shared ${fileUrls.length} file(s)`,
            files: fileUrls,
            messageType: 'file'
        });

        if (!conversastion) {
            conversastion = await Conversation.create({
                participants: [sender, reciver],
                messages: [newMessage._id]
            });
        } else {
            conversastion.messages.push(newMessage._id);
            await conversastion.save();
        }

        // Emit file message through socket if available
        if (req.io && req.onlineUsers) {
            const recipient = Array.from(req.onlineUsers.entries())
                .find(([userId]) => userId === reciver);
            
            if (recipient) {
                const [userId, userData] = recipient;
                req.io.to(userData.socketId).emit('newMessage', {
                    messageId: newMessage._id,
                    senderId: sender,
                    recipientId: reciver,
                    message: newMessage.message,
                    type: 'file',
                    metadata: { files: fileUrls },
                    timestamp: new Date()
                });
            }
        }

        return res.status(201).json({
            message: "Files uploaded successfully",
            data: newMessage,
            files: fileUrls
        });

    } catch (error) {
        return res.status(500).json({ 
            message: "Internal Server Error", 
            error: error.message 
        });
    }
}