import mongoose from 'mongoose';
const messageSchema = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reciver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },    message:{
        type: String,
        default:""
    },
    image:{
        type: String,
        default: ""
    },
    files:[{
        name: String,
        url: String,
        size: Number,
        type: String
    }],    messageType:{
        type: String,
        enum: ['text', 'image', 'file', 'code', 'terminal'],
        default: 'text'
    },
    metadata: {
        type: Object,
        default: {}
    },
    read: {
        type: Boolean,
        default: false
    },
    delivered: {
        type: Boolean,
        default: false
    }

},{timestamps: true});

const Message = mongoose.model("Message", messageSchema);
export default Message;