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
        let {name}=req.body
        let image;
        if(req.file){
            image=await uplodOnCloudinary(req.file.path)
        }

        let user = await User.findByIdAndUpdate(
            req.userId,
            {
                ...(name && { name }),
                ...(image && { image })
            },
            { new: true } // Return the updated user
        ).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Remove any undefined fields from the returned user object
        const userObj = user.toObject();
        if (userObj.image === undefined) delete userObj.image;
        if (userObj.name === undefined) delete userObj.name;
        return res.status(200).json(userObj)
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
}