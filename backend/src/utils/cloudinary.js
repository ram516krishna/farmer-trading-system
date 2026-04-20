import { v2 as cloudinary } from "cloudinary"
import env from "../config/env.js";
import fs from "fs"

cloudinary.config({
    cloud_name: env.CLOUD_NAME,
    api_key: env.API_KEY,
    api_secret: env.API_SECRET,
});

export const uploadToCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "farmer-trading-system",
        });

        fs.unlinkSync(localFilePath)
        return res;

    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null;
    }
}


export const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null;
        
        const res = await cloudinary.uploader.destroy(publicId);
        return res;
    } catch (error) {
        return null;
    }
}