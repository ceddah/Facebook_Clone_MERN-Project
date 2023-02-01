const User = require("../models/User");
const Code = require("../models/Code");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateEmail, validateLength, validateUsername } = require("../helpers/validation");
const { generateToken } = require("../helpers/tokens");
const { sendVerificationEmail, sendResetCode } = require("../helpers/mailer");
const generateCode = require("../helpers/generateCode");

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, username, email, password, bYear, bMonth, bDay, gender } =
      req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Invalid E-Mail Address.",
      });
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        message: "E-Mail Address already exists. Try to register with different E-Mail",
      });
    }

    if (!validateLength(first_name, 3, 30)) {
      return res.status(400).json({
        message: "First name must be between 3 and 30 characters long.",
      });
    }

    if (!validateLength(last_name, 3, 30)) {
      return res.status(400).json({
        message: "Last name must be between 3 and 30 characters long.",
      });
    }

    if (!validateLength(password, 6, 30)) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
      });
    }

    const cryptedPassword = await bcrypt.hash(password, 12);

    let tempUsername = first_name + last_name;
    const newUsername = await validateUsername(tempUsername);

    const user = await new User({
      first_name,
      last_name,
      username: newUsername,
      email,
      password: cryptedPassword,
      bYear,
      bMonth,
      bDay,
      gender,
    }).save();

    const emailVerificationToken = generateToken({ id: user._id.toString() }, "30m");
    const frontend_verification_url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
    sendVerificationEmail(user.email, user.first_name, frontend_verification_url);
    const token = generateToken({ id: user._id.toString() }, "7d");

    res.status(201).send({
      id: user._id,
      username: user.username,
      picture: user.picture,
      first_name: user.first_name,
      last_name: user.last_name,
      token,
      verified: user.verified,
      message: "Register success! Please activate your E-Mail address.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.activateAccount = async (req, res) => {
  try {
    const validUser = req.user.id;
    const { token } = req.body;
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const check = await User.findById(user.id);

    if (validUser !== user.id) {
      return res.status(400).json({
        message: "You don't have authorization to complete this operation.",
      });
    }

    if (check.verified === true) {
      return res.status(400).json({
        message: "This Account is already activated.",
      });
    } else {
      await User.findByIdAndUpdate(user.id, { verified: true });
      return res.status(200).json({
        message: "Account has been activated successfully.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "The E-Mail address you provided is not connected to an Account.",
      });
    }
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res.status(400).json({
        message: "Invalid credentials. Please try again.",
      });
    }
    const token = generateToken({ id: user._id.toString() }, "7d");

    res.status(201).send({
      id: user._id,
      username: user.username,
      picture: user.picture,
      first_name: user.first_name,
      last_name: user.last_name,
      token,
      verified: user.verified,
      gender: user.gender,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendVerification = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    if (user.verified === true) {
      return res.status(400).json({ message: "This account has already been activated." });
    }

    const emailVerificationToken = generateToken({ id: user._id.toString() }, "30m");
    const frontend_verification_url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
    sendVerificationEmail(user.email, user.first_name, frontend_verification_url);

    return res.status(200).json({
      message: "Email verification link has been sent to your email.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res.status(400).json({
        message: "Account with this email address does not exist.",
      });
    }
    return res.status(200).json({
      email: user.email,
      picture: user.picture,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendResetPasswordCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");
    await Code.findOneAndRemove({ user: user._id });
    const code = generateCode(5);
    const savedCode = await Code.create({ code, user: user._id });
    sendResetCode(user.email, user.first_name, code);
    return res.status(200).json({
      message: "Email reset code has been sent to your email",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.validateResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email }).select("-password");
    const dbCode = await Code.findOne({ user: user._id });
    if (!dbCode || dbCode.code !== code) {
      return res.status(400).json({
        message: "Verification code is wrong..",
      });
    }
    return res.status(200).json({ messaage: "Ok" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cryptedPassword = await bcrypt.hash(password, 12);
    await User.findOneAndUpdate(
      { email },
      {
        password: cryptedPassword,
      }
    );
    return res.status(201).json({ message: "Ok" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findById(req.user.id);
    const friendship = {
      friends: false,
      following: false,
      requestSent: false,
      requestReceived: false,
    };
    const profile = await User.findOne({ username }).select("-password");

    if (!profile) {
      return res.status(400).json({ ok: false });
    }

    if (user.friends.includes(profile._id) && profile.friends.includes(user._id)) {
      friendship.friends = true;
    }
    if (user.following.includes(profile._id)) {
      friendship.following = true;
    }
    if (user.requests.includes(profile._id)) {
      friendship.requestReceived = true;
    }
    if (profile.requests.includes(user._id)) {
      friendship.requestSent = true;
    }

    const posts = await Post.find({ user: profile._id }).populate("user").sort({ createdAt: -1 });
    await profile.populate("friends", "first_name last_name username picture");
    res.status(200).json({ ...profile.toObject(), posts, friendship });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateProfilePicture = async (req, res) => {
  try {
    const { url } = req.body;
    await User.findByIdAndUpdate(req.user.id, {
      picture: url,
    });
    res.status(201).json({ url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateCover = async (req, res) => {
  try {
    const { url } = req.body;
    await User.findByIdAndUpdate(req.user.id, {
      cover: url,
    });
    res.status(201).json({ url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateDetails = async (req, res) => {
  try {
    const { infos } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        details: infos,
      },
      {
        new: true,
      }
    );
    res.status(201).json(updated.details);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.addFriend = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (!receiver.requests.includes(sender._id) && !receiver.friends.includes(sender._id)) {
        await receiver.updateOne({
          $push: {
            requests: sender._id,
          },
        });
        await receiver.updateOne({
          $push: {
            followers: sender._id,
          },
        });
        await sender.updateOne({
          $push: {
            following: receiver._id,
          },
        });
        res.json({ message: "Friend request has been sent" });
      } else {
        return res.status(400).json({
          message: "Request was already sent to this user.",
        });
      }
    } else {
      return res.status(400).json({
        message: "You can't send a request to yourself.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.cancelRequest = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (receiver.requests.includes(sender._id) && !receiver.friends.includes(sender._id)) {
        await receiver.updateOne({
          $pull: {
            requests: sender._id,
          },
        });
        await receiver.updateOne({
          $pull: {
            followers: sender._id,
          },
        });
        await sender.updateOne({
          $pull: {
            following: receiver._id,
          },
        });
        res.json({ message: "Friend request has been cancelled." });
      } else {
        return res.status(400).json({
          message: "Request was already cancelled.",
        });
      }
    } else {
      return res.status(400).json({
        message: "You can't cancel a request to yourself.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.follow = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (!receiver.followers.includes(sender._id) && !sender.following.includes(receiver._id)) {
        await receiver.updateOne({
          $push: {
            followers: sender._id,
          },
        });
        await sender.updateOne({
          $push: {
            following: receiver._id,
          },
        });
        res.json({ message: "You are now following " + receiver?.username });
      } else {
        return res.status(400).json({
          message: "Request was already sent.",
        });
      }
    } else {
      return res.status(400).json({
        message: "You can't follow yourself.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.unfollow = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (receiver.followers.includes(sender._id) && sender.following.includes(receiver._id)) {
        await receiver.updateOne({
          $pull: {
            followers: sender._id,
          },
        });
        await sender.updateOne({
          $pull: {
            following: receiver._id,
          },
        });
        res.json({ message: "You are no longer following " + receiver?.username });
      } else {
        return res.status(400).json({
          message: "Request was already cancelled.",
        });
      }
    } else {
      return res.status(400).json({
        message: "You can't cancel a request to yourself.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.acceptRequest = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const receiver = await User.findById(req.user.id);
      const sender = await User.findById(req.params.id);
      if (receiver.requests.includes(sender._id)) {
        await receiver.update({
          $push: {
            friends: sender._id,
            following: sender._id,
          },
        });
        await receiver.updateOne({
          $pull: {
            requests: sender._id,
          },
        });
        await sender.update({
          $push: {
            friends: receiver._id,
            followers: receiver._id,
          },
        });
        res.json({ message: "You are are now friends with " + sender?.username });
      } else {
        return res.status(400).json({
          message: "This request is no longer valid.",
        });
      }
    } else {
      return res.status(400).json({
        message: "You can't accept a request to yourself.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.unfriend = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (sender.friends.includes(receiver._id) && receiver.friends.includes(sender._id)) {
        await receiver.update({
          $pull: {
            friends: sender._id,
            followers: sender._id,
            following: sender._id,
          },
        });
        await sender.update({
          $pull: {
            friends: receiver._id,
            followers: receiver._id,
            following: receiver._id,
          },
        });
        res.json({ message: "You are are no longer friends with " + receiver?.username });
      } else {
        return res.status(400).json({
          message: "This request is no longer valid.",
        });
      }
    } else {
      return res.status(400).json({
        message: "You can't unfriend yourself.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteRequest = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const receiver = await User.findById(req.user.id);
      const sender = await User.findById(req.params.id);
      if (receiver.requests.includes(sender._id)) {
        await receiver.update({
          $pull: {
            requests: sender._id,
            followers: sender._id,
          },
        });
        await sender.update({
          $pull: {
            following: receiver._id,
          },
        });
        res.json({ message: "You cancelled a request to be friends with " + sender?.username });
      } else {
        return res.status(400).json({
          message: "This request is no longer valid.",
        });
      }
    } else {
      return res.status(400).json({
        message: "You can't delete a request to yourself.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
