import multer from 'multer';
import path from 'path';

/**
 * Multer configuration for file uploads
 * Uses memory storage for compatibility with serverless functions (Vercel)
 * Files are stored in memory and then uploaded to Cloudinary
 */
const storage = multer.memoryStorage();

// File filter - accept images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

