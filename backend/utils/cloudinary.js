import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load env variables early
dotenv.config();

// Validate that env variables exist
if (
    !process.env.CLOUDINARY_CLOUD_NAME,
    !process.env.CLOUDINARY_API_KEY,
    !process.env.CLOUDINARY_API_SECRET
) {
    console.error("🚨 Cloudinary env variables are missing. Please check your .env file.");
    process.exit(1); // stop the server if config is invalid
}

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("✅ Cloudinary configured successfully.");

// Upload function — with extra checks and logs
export const upload_file = async (file, folder) => {
    if (!file) throw new Error("No file provided for upload.");

    console.log("📤 Uploading file to Cloudinary...");

    try {
        const result = await cloudinary.uploader.upload(file, {
            resource_type: "image",
            folder,
        });

        if (!result || !result.public_id) {
            throw new Error("Cloudinary returned invalid upload result.");
        }

        console.log("✅ File uploaded:", result.secure_url);

        return {
            public_id: result.public_id,
            url: result.secure_url,
        };
    } catch (error) {
        console.error("❌ Cloudinary Upload Error:", error);
        throw new Error("Cloudinary Upload Failed: " + error.message);
    }
};

// Delete function — with logs
export const delete_file = async (public_id) => {
    if (!public_id) throw new Error("No public_id provided for deletion.");

    console.log("🗑 Deleting file from Cloudinary with public_id:", public_id);

    try {
        const res = await cloudinary.uploader.destroy(public_id);

        console.log("📝 Cloudinary delete response:", res);

        if (res.result !== "ok" && res.result !== "not found") {
            throw new Error("Failed to delete file on Cloudinary. Result: " + res.result);
        }

        if (res.result === "not found") {
            console.warn("⚠️ File not found on Cloudinary.");
            return false;
        }

        console.log("✅ File deleted successfully.");
        return true;
    } catch (error) {
        console.error("❌ Cloudinary Delete Error:", error);
        throw new Error("Cloudinary Delete Failed: " + error.message);
    }
};

