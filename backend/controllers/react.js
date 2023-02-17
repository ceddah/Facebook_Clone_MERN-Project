const React = require("../models/React");
const User = require("../models/User");
const mongoose = require("mongoose");

exports.reactPost = async (req, res) => {
  try {
    const { postId, react } = req.body;
    const check = await React.findOne({
      postRef: postId,
      reactBy: mongoose.Types.ObjectId(req.user.id),
    });

    if (!check) {
      //create reaction
      const newReact = new React({
        postRef: postId,
        reactBy: req.user.id,
        react,
      });
      await newReact.save();
    } else if (check && check.react === react) {
      //remove it
      await React.findByIdAndRemove(check._id);
    } else if (check && check.react !== react) {
      //modify it
      await React.findByIdAndUpdate(check._id, { react });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.getReacts = async (req, res) => {
  try {
    const reactsArray = await React.find({ postRef: req.params.id });
    const newReacts = reactsArray.reduce((group, react) => {
      let key = react["react"];
      group[key] = group[key] || [];
      group[key].push(react);
      return group;
    }, {});

    const reacts = [
      {
        react: "like",
        count: newReacts.like ? newReacts.like.length : 0,
      },
      {
        react: "love",
        count: newReacts.love ? newReacts.love.length : 0,
      },
      {
        react: "haha",
        count: newReacts.haha ? newReacts.haha.length : 0,
      },
      {
        react: "sad",
        count: newReacts.sad ? newReacts.sad.length : 0,
      },
      {
        react: "wow",
        count: newReacts.wow ? newReacts.wow.length : 0,
      },
      {
        react: "angry",
        count: newReacts.angry ? newReacts.angry.length : 0,
      },
    ];
    const check = await React.findOne({
      postRef: req.params.id,
      reactBy: req.user.id,
    });
    const user = await User.findById(req.user.id);
    const checkSaved = user.savedPosts.find((x) => x.post.toString() === req.params.id);

    res
      .status(200)
      .json({
        reacts,
        check: check?.react,
        total: reactsArray.length,
        checkSaved: checkSaved ? true : false,
      });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
