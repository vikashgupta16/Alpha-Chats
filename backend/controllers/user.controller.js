import User from "../models/user.model.js";

export const getCurrentUser=async (req,res)=>{
    try {
        let userId=req.userId
        let user=await User.findById(userId).select("-password")
        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        return res.status(200).json({user})
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
}