const Post = require("../models/Post");
const User = require("../models/User");

exports.createPost = async (req, res) => {
  try {
    const post = await new Post(req.body).save();
    await Post.populate(post, {
      path: "user",
      select: "first_name last_name picture username cover",
    });
    res.json({ post });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const { following } = await User.findById(req.user.id).select("following");
    const promises = following.map((user) => {
      return Post.find({ user })
        .populate("user", "first_name last_name picture username cover")
        .populate("comments.commentBy", "first_name last_name picture username commentAt")
        .sort({ createdAt: -1 })
        .limit(10);
    });
    const posts = await (await Promise.all(promises)).flat();
    const userPosts = await Post.find({ user: req.user.id })
      .populate("user", "first_name last_name picture username cover")
      .populate("comments.commentBy", "first_name last_name picture username commentAt")
      .sort({ createdAt: -1 })
      .limit(10);
    const allPosts = [...posts, ...userPosts];
    allPosts.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    res.status(200).json({
      allPosts,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.comment = async (req, res) => {
  try {
    const { comment, image, postId } = req.body;
    let newComments = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            comment: comment,
            image: image,
            commentBy: req.user.id,
            commentAt: new Date(),
          },
        },
      },
      {
        new: true,
      }
    ).populate("comments.commentBy", "picture first_name last_name username");
    res.status(200).json({
      comments: newComments.comments,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.savePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const user = await User.findById(req.user.id);
    const alreadySaved = user?.savedPosts.find((p) => p.post.toString() === postId);
    if (alreadySaved) {
      await User.findByIdAndUpdate(req.user.id, {
        $pull: {
          savedPosts: {
            _id: alreadySaved._id,
          },
        },
      });
    } else {
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          savedPosts: {
            post: postId,
            savedAt: new Date(),
          },
        },
      });
    }
    res.status(200);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    await Post.findByIdAndRemove(postId);
    res.status(200).json({
      status: "ok",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
