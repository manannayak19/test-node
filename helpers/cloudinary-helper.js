const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (e) {
    console.error("Error while upload to cloudinary", e);
    throw new Error("Error while upload to cloudinary", e);
  }
};

module.exports = {
  uploadToCloudinary,
};
