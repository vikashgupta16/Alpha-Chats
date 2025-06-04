import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User",
            required: true
       }],    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        }
    ],
    lastMessage: {
        type: Date,
        default: Date.now
    },
    unreadCount: {
        type: Map,
        of: Number,
        default: new Map()
    }
}, { timestamps: true });

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;