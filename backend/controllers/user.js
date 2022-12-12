const User = require("../models/User");
const bcrypt = require("bcrypt");
const { validateEmail, validateLength, validateUsername } = require("../helpers/validation");

exports.register = async (req, res, next) => {
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

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
