import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return "File not found" || null
        //File upload
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        console.log("File Uploaded: ",response.url);
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null
    }
}


export {uploadOnCloudinary}

