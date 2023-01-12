const express = require("express");
const router = express.Router();
const { uploadImages } = require("../controllers/upload");
const { authUser } = require("../middleware/auth");
const imageUpload = require("../middleware/imageUpload");

router.post("/uploadImages", imageUpload, uploadImages);

module.exports = router;
