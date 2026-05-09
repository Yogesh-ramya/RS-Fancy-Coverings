const multer = require('multer');
const cloudinaryStorage = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'jewelry-products',
  allowedFormats: ['jpg', 'png', 'jpeg'],
  transformation: [{ width: 800, height: 1000, crop: 'limit' }]
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

module.exports = upload;
