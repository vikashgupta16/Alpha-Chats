import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
export const signUp = async (req,res) => {

    try {
        const {userName, github, password} = req.body
        const checkUserByUserName=await User.findOne({userName})
        if(checkUserByUserName){
          return res.status(400).json({message:"User already exists"})  
        }
        const checkUserByGithub=await User.findOne({github})
        if(checkUserByGithub){
          return res.status(400).json({message:"User already exists"})  
        }
        if(password.length<6){
            return res.status(400).json({message:"Password must be atleast 6 characters"})
        }

        const hashedPassword=await bcrypt.hash(password,10)
        const user=await User.create({
            userName,
            github,
            password:hashedPassword
        })

        const token=await genToken(user._id)

        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite:"none",
            maxAge:7*24*60*60*1000
        })

        return res.status(201).json(user)
    } catch (error) {
        return res.status(500).json({message:`Internal server Error ${error}`})
    }
}

export const login = async (req,res) => {

    try {
        const {github, password} = req.body
        const user=await User.findOne({github})
        if(!user){
          return res.status(400).json({message:"User does not exists"})  
        }
        

        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"})
        }        

        const token=await genToken(user._id)

        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite:"none",
            maxAge:7*24*60*60*1000
        })

        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message:`Internal server Error ${error}`})
    }
}

export const logout = async (req,res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({message:"Logged out successfully"})
    } catch (error) {
        return res.status(500).json({message:`Internal server Error ${error}`})
    }
}