import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Check if Cloudinary is configured
 */
const isCloudinaryConfigured = () => {
  return !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
};

/**
 * Upload image buffer to Cloudinary
 * @param {Buffer} buffer - Image buffer
 * @param {string} folder - Folder name in Cloudinary (optional)
 * @returns {Promise<string>} - URL of uploaded image
 */
export const uploadToCloudinary = async (buffer, folder = 'social-posts') => {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    // Convert buffer to stream
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};

/**
 * Upload multiple images to Cloudinary
 * @param {Array<{buffer: Buffer, mimetype: string}>} files - Array of file objects with buffer and mimetype
 * @param {string} folder - Folder name in Cloudinary (optional)
 * @returns {Promise<string[]>} - Array of uploaded image URLs
 */
export const uploadMultipleToCloudinary = async (files, folder = 'social-posts') => {
  try {
    const uploadPromises = files.map(file => uploadToCloudinary(file.buffer, folder));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    throw new Error(`Failed to upload images: ${error.message}`);
  }
};
