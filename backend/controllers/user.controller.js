import { upload } from "../middlewares/multer.js";
import User from "../models/user.model.js";
import uplodOnCloudinary from "../config/cloudinary.js";

export const getCurrentUser=async (req,res)=>{
    try {
        let userId=req.userId
        let user=await User.findById(userId).select("-password")
        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
}

export const editProfile=async(req,res)=>{
    try {
        console.log('🔍 editProfile called')
        console.log('📝 Request body:', req.body)
        console.log('📁 Request file:', req.file)
        console.log('📋 Request headers content-type:', req.headers['content-type'])
        
        let {name}=req.body
        console.log('📝 Edit profile request - name:', name)
        console.log('📁 File received:', req.file ? 'Yes' : 'No')
        
        let image;
        if(req.file){
            console.log('📁 File details:', {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                path: req.file.path
            })
            console.log('📤 Uploading to Cloudinary...')
            image=await uplodOnCloudinary(req.file.path)
            console.log('✅ Cloudinary upload result:', image)
        } else {
            console.log('❌ No file found in request')
        }
        
        let user = await User.findByIdAndUpdate(req.userId,
            {
                name,
                image
            },
            { new: true } // Return the updated user
        ).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        console.log('👤 Updated user:', user)
        return res.status(200).json(user)
    } catch (error) {
        console.error('❌ Edit profile error:', error)
        return res.status(500).json({message:"Internal server error"})
    }
}

export const getOtherUser=async(req,res)=>{
    try {
        let users=await User.find({
            _id:{$ne:req.userId}})
            .select("-password")
            return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
}