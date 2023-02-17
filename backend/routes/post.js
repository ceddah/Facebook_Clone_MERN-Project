const express = require("express");
const router = express.Router();
const { createPost, getAllPosts, comment, savePost, deletePost } = require("../controllers/post");
const { authUser } = require("../middleware/auth");

router.post("/createPost", authUser, createPost);
router.get("/getAllPosts", authUser, getAllPosts);
router.put("/comment", authUser, comment);
router.put("/savePost/:id", authUser, savePost);
router.delete("/deletePost/:id", authUser, deletePost);

module.exports = router;
