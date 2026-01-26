import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({});

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

export const uploadMedia = async (file) => {
  try {
    // Use upload_large for better handling of video files
    // This uses chunked uploading for files > 100MB
    const uploadResponse = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
      chunk_size: 6000000, // 6MB chunks for large files
      timeout: 600000, // 10 minute timeout
    });
    return uploadResponse;
  } catch (error) {
    console.log("Cloudinary upload error:", error);
    throw error;
  }
};

export const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(error);
  }
};

export const deleteVideoFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
  } catch (error) {
    console.log(error);
  }
};
