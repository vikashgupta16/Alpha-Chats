import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

const uplodOnCloudinary = async (filePath) => {
    // Check if we're in development with mock credentials
    const isDevelopmentMock = process.env.NODE_ENV === 'development' && 
                              process.env.CLOUDINARY_CLOUD_NAME === 'dev-mock';
    
    if (isDevelopmentMock) {
        console.log('🟡 Development mode: Skipping Cloudinary upload, using placeholder');
        
        // Clean up the temp file
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        // Return a placeholder URL for development
        return `https://via.placeholder.com/400x300.png?text=Dev+Image`;
    }

    // Production/real Cloudinary configuration
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })

    try {
        const uploadResult = await cloudinary.uploader.upload(filePath)
        fs.unlinkSync(filePath) // Delete the file after upload
        return uploadResult.secure_url
    } catch (error) {
        // Clean up temp file on error
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        console.error('❌ Cloudinary upload error:', error);
        throw error;
    }
}

export default uplodOnCloudinary;