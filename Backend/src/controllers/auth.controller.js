import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken"
import config  from "../config/config.js";


async function sendTokenResponse(user, res, message) {
    const token = jwt.sign({
        id: user._id
    }, config.JWT_SECRET, {
        expiresIn: "7d"
    });

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
        message,
        success: true,
        user: {
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
            role: user.role
        }
    });
}


export const register = async (req, res) => {
    const { email, contact, password, fullname, isSeller } = req.body;
    console.log(email,contact,password,fullname,isSeller);

    try {
        const existingUser = await userModel.findOne({
            $or: [
                { email },
                { contact }
            ]
        })

        if (existingUser) {
            return res.status(400).json({ message: "User with this email or contact already exists" });
        }

        const user = await userModel.create({
            email,
            contact,
            password,
            fullname,
            role: isSeller ? "seller" : "buyer"
        });

        await sendTokenResponse(user,res,"User registered successfully");



    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error" });
    }
}

export const login=async (req,res)=>{
    const {identifier,password}=req.body;
    try {
        const user=await userModel.findOne(
            {
                $or:[
                    {email:identifier},
                    {username:identifier}
                ]
            }
        );
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const isPasswordValid=await user.comparePassword(password);
        if(!isPasswordValid){
            return res.status(401).json({message:"Invalid password"});
        }
        await sendTokenResponse(user,res,"User logged in successfully");
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error" });
    }
}

export const googleCallback = async (req, res) => {
    const {id,emails,displayName}=req.user;
    const email=emails[0].value;
    const name=displayName;

    let user=await userModel.findOne({
        email
    });

    if(!user){
        user=await userModel.create({
            email,
            fullname:name,
            googleId:id
        });
    }

    const token=jwt.sign({
        id:user._id
    },config.JWT_SECRET,{
        expiresIn:"7d"
    });

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    res.cookie("token", token, cookieOptions);

    res.redirect("https://fit-fusion-kappa-wheat.vercel.app");
}

export const getMe=async (req,res)=>{
    try {
        const user=await userModel.findById(req.user.id);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json({
            message:"User found",
            success:true,
            user:{
                email: user.email,
                contact: user.contact,
                fullname: user.fullname,
                role: user.role
            }
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error" });
    }
}