import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const admin = await Admin.findOne({email});

        if(!admin){
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if(!isPasswordValid){
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({id: admin._id}, env.JWT_SECRET, {expiresIn: "1h"});

        res.cookie("token", token, {
            httpOnly: true,
            secure:true,
            sameSite:"none",
            maxAge: 24 * 60 * 60 * 1000
        });


        res.status(200).json({ success: true, message: "Login successful", data:{
            name: admin.name,
            email: admin.email,
            id: admin._id
        }});

        
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const getAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.adminId).select("-password");
        res.status(200).json({ success: true, data: admin });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const logout = (req, res) => {
    res.clearCookie("token",{
        maxAge:0,
        httpOnly: true,
        secure:true,
        sameSite:"none"
    });
    res.status(200).json({ success: true, message: "Logout successful" });
}
