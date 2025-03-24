const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const uploadedMiddleware = require("../middleware/upload-image");
const {
  uploadImage,
  fetchImagesController,
  deleteImageController,
} = require("../controllers/image-controller");

//upload the image
router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  uploadedMiddleware.single("image"),
  uploadImage
);

//get all the images
router.get("/get", authMiddleware, fetchImagesController);

//delete iamge  //uploaded by 67d12ed89db6afe4607da7c7
router.delete("/:id", authMiddleware, adminMiddleware, deleteImageController);

module.exports = router;
