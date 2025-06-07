import multer from 'multer';

// Use memory storage for cloud deployments (Render, Vercel, etc.)
// This stores files in memory temporarily instead of writing to disk
const storage = multer.memoryStorage();

export const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1 // Only allow 1 file at a time
    },
    fileFilter: (req, file, cb) => {
        console.log('🔍 Multer fileFilter called:', {
            fieldname: file.fieldname,
            originalname: file.originalname,
            mimetype: file.mimetype
        });
        
        // Check if file is an image
        const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        
        if (allowedMimes.includes(file.mimetype)) {
            console.log('✅ File type accepted');
            cb(null, true);
        } else {
            console.log('❌ File type rejected:', file.mimetype);
            cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'), false);
        }
    }
});