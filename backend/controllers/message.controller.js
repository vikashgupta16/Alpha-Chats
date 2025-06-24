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
        }        let conversation=await Conversation.findOne({
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

        if(!conversation){
            conversation=await Conversation.create({
                participants:[sender, reciver],
                messages:[newMessage._id]
            })
            console.log('📁 New conversation created');
        }else{
            conversation.messages.push(newMessage._id);
            await conversation.save();
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
        let conversation=await Conversation.findOne({
            participants:{$all:[sender, reciver]}
        }).populate("messages")
        
        if(!conversation){
            console.log('📭 No conversation found, returning empty array');
            return res.status(200).json([]);
        }

        console.log('📬 Found conversation with messages:', conversation.messages?.length || 0);
        return res.status(200).json(conversation?.messages || []);
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
        }        // Create message with file attachments
        let conversation = await Conversation.findOne({
            participants: { $all: [sender, reciver] }
        });
        
        let newMessage = await Message.create({
            sender, 
            reciver, 
            message: `Shared ${fileUrls.length} file(s)`,
            files: fileUrls,
            messageType: 'file'
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [sender, reciver],
                messages: [newMessage._id]
            });
        } else {
            conversation.messages.push(newMessage._id);
            await conversation.save();
        }        // DO NOT emit file message through socket here
        // File messages should follow the same pattern as text messages:
        // 1. HTTP response gives message to sender
        // 2. Socket.IO delivers to recipient only (if frontend chooses to use it)
        // Emitting here causes duplicates because the frontend may also send via socket
        
        console.log('📁 File message created, HTTP response sent to sender');
        console.log('ℹ️ Socket delivery should be handled by frontend if needed');

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

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
    try {
        const { senderId } = req.params;
        const receiverId = req.userId; // Current user receiving the messages
        
        console.log(`📖 [markMessagesAsRead] Marking messages as read from sender ${senderId} to receiver ${receiverId}`);
        
        // Update all unread messages from senderId to current user
        const result = await Message.updateMany(
            { 
                sender: senderId, 
                reciver: receiverId, 
                read: false 
            },
            { $set: { read: true } }
        );
        
        console.log(`✅ [markMessagesAsRead] Marked ${result.modifiedCount} messages as read`);
        
        return res.status(200).json({
            message: "Messages marked as read successfully",
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('❌ [markMessagesAsRead] Error:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
};