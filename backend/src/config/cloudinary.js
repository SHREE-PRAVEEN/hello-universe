const cloudinary = require("cloudinary").v2;
let cloudinary;

try {
  cloudinary = require("cloudinary").v2;

  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
} catch (err) {
  console.warn("Cloudinary not available - media uploads disabled");
  cloudinary = {};
}

module.exports = cloudinary;
