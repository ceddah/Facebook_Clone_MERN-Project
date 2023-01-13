const express = require("express");
const router = express.Router();
const { uploadImages } = require("../controllers/upload");
const { authUser } = require("../middleware/auth");
const imageUploadCheck = require("../middleware/imageUpload");

router.post("/uploadImages", authUser, imageUploadCheck, uploadImages);

module.exports = router;
