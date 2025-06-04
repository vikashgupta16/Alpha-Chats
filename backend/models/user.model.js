import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
    },
    userName:{
        type:String,
        required:true,
        unique:true
    },
    github:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },    image:{
        type:String,
        default:""
    },
    status: {
        type: String,
        enum: ['online', 'offline', 'away', 'busy'],
        default: 'offline'
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    isOnline: {
        type: Boolean,
        default: false
    }
},{timestamps:true})

const User=mongoose.model("User",userSchema)

export default User