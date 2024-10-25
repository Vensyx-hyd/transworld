// uploadVendorServiceFile.js
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');

// Configure Cloudinary with credentials
cloudinary.config({
  cloud_name: 'df8kh60xu',
  api_key: '261529189275742',
  api_secret: 'OBVYsKSfjhTp0dTdwmYD4djzX-8',
});

// Configure Multer to store uploaded files in the 'uploads/' directory temporarily
const upload = multer({
  dest: path.join(__dirname, 'uploads/'), // Adjust path to correct location
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});


// Function to handle Cloudinary upload
const uploadToCloudinary = (filePath, vendorName) => {
  return cloudinary.uploader.upload(filePath, {
    resource_type: 'auto',
    folder: 'TG_APP', // Use the 'tg_app' folder as mentioned earlier
    public_id: vendorName, // Rename the file based on vendorName
    use_filename: true, // Keep original file name if needed
  });
};

module.exports = { upload, uploadToCloudinary };










// const cloudinary = require('cloudinary').v2;

// cloudinary.config({
//   cloud_name: 'df8kh60xu',
//   api_key: '261529189275742',
//   api_secret: 'OBVYsKSfjhTp0dTdwmYD4djzX-8',
// });

// class UploadVendorServiceFile {
//   async uploadFileToCloudinary(filePath) {
//     try {
//       const result = await cloudinary.uploader.upload(filePath, {
//         folder: 'TG_APP',  // Upload to TG_APP folder
//       });
//       return result;
//     } catch (error) {
//       throw new Error(`Cloudinary upload failed: ${error.message}`);
//     }
//   }
// }

// module.exports = new UploadVendorServiceFile();
