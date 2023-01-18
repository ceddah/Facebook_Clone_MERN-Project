const express = require("express");
const router = express.Router();
const { createPost, getAllPosts } = require("../controllers/post");
const { authUser } = require("../middleware/auth");

router.post("/createPost", authUser, createPost);
router.get("/getAllPosts", authUser, getAllPosts);

module.exports = router;
