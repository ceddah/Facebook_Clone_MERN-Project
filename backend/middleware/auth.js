const JWT = require("jsonwebtoken");

exports.authUser = async (req, res, next) => {
  try {
    let tmp = req.headers["authorization"];
    const token = tmp?.split(" ")[1];
    if (!token) {
      return res.status(400).json({
        message: "Invalid Authentication.",
      });
    }
    JWT.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(400).json({
          message: "Jwt couldn't verify your token.. Your token could have expired.",
        });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
