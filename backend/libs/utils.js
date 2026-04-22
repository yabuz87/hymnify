import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
export const generateToken=(userId,res)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"2d"})
    res.cookie("jwt", token, {
        maxAge: 2 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true, // Required for sameSite: 'none'
        sameSite: "none", // Required for cross-site cookies (Vercel to Render)
    });
    return token;
}