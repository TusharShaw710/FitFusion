import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";


export async function authenticateSeller(req,res,next){
    const token=req.cookies.token;

    if(!token){
        return res.status(401).json({message:"Not logged in our system"})
    }

    try {
        const decodedToken=jwt.verify(token,config.JWT_SECRET);

        const user= await userModel.findById(decodedToken.id);
        
        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        if(user.role !== "seller"){
            return res.status(403).json({message:"Unauthorized"})
        }

        req.user=user;
        next();
    } catch (error) {
        return res.status(401).json({message:"Unauthorized"})
    }
}

export async function authenticateUser(req,res,next){
    const token=req.cookies.token;

    if(!token){
        return res.status(401).json({message:"Not logged in our system"})
    }

    try {
        const decodedToken=jwt.verify(token,config.JWT_SECRET);

        const user= await userModel.findById(decodedToken.id);
        
        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        req.user=user;
        next();
    } catch (error) {
        return res.status(401).json({message:"Unauthorized"})
    }
}