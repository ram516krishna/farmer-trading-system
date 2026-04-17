import jwt from "jsonwebtoken";
import env from "../config/env.js";
import Admin from "../models/Admin.js";

export const isAdmin = async(req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);

    const adminId = decoded.id;

    if (!adminId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    
    // You might want to fetch admin details from database here
    const admin = await Admin.findById(adminId);

    if (!admin) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    
    // For now, we'll just check if the ID exists
    req.adminId = admin._id;
    next();
};