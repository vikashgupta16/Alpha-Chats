import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('📁 Multer destination called for file:', file.originalname);
        cb(null, './public');
    },
    filename: (req, file, cb) => {
        console.log('📝 Multer filename called for file:', file.originalname);
        cb(null, file.originalname);
    }
});

export const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        console.log('🔍 Multer fileFilter called:', {
            fieldname: file.fieldname,
            originalname: file.originalname,
            mimetype: file.mimetype
        });
        cb(null, true);
    }
});