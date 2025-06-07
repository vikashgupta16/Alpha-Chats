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
        console.log('👤 User ID:', req.userId)
        
        // Validate user ID
        if (!req.userId) {
            console.log('❌ No user ID found in request');
            return res.status(401).json({ message: "Authentication required" });
        }
        
        let {name}=req.body
        console.log('📝 Edit profile request - name:', name)
        console.log('📁 File received:', req.file ? 'Yes' : 'No')
        
        // Validate that at least one field is being updated
        if (!name && !req.file) {
            console.log('❌ No update data provided');
            return res.status(400).json({ message: "Please provide name or image to update" });
        }
          let image;
        if(req.file){
            console.log('📁 File details:', {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                bufferSize: req.file.buffer ? req.file.buffer.length : 'No buffer'
            })
            console.log('📤 Uploading to Cloudinary...')
            try {
                // Pass buffer and original name to Cloudinary function
                image = await uplodOnCloudinary(req.file.buffer, req.file.originalname)
                console.log('✅ Cloudinary upload result:', image)
            } catch (cloudinaryError) {
                console.error('❌ Cloudinary upload failed:', cloudinaryError)
                return res.status(500).json({
                    message: "Image upload failed", 
                    error: cloudinaryError.message
                })
            }
        } else {
            console.log('ℹ️ No file found in request')
        }
        
        // Build update object conditionally
        const updateData = {};
        if (name && name.trim()) {
            updateData.name = name.trim();
        }
        if (image) {
            updateData.image = image;
        }
        
        console.log('📝 Update data:', updateData);
        
        let user = await User.findByIdAndUpdate(req.userId,
            updateData,
            { new: true } // Return the updated user
        ).select("-password");
        
        if (!user) {
            console.log('❌ User not found with ID:', req.userId);
            return res.status(404).json({ message: "User not found" });
        }
        
        console.log('👤 Updated user:', user)
        return res.status(200).json(user)
    } catch (error) {
        console.error('❌ Edit profile error:', error)
        console.error('❌ Error stack:', error.stack)
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
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