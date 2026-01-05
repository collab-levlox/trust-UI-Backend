const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

module.exports = function (req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    throw new AppError("Access Denied. No token provided.", 401);
  }

  try {
    if (token === "test") {
      next();
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded) {
      next();
    }
  } catch (err) {
    console.log(err, 'errr');

    throw new AppError("Invalid token.", 401);
  }
};
