const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { HttpError } = require("./error");

const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWTSECRET, {
    expiresIn: "30d",
  });

  return token;
};

const generateHash = async (text) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(text, salt);
  return hash;
};

const verifyPassword = async (text1, text2) => {
  const result = await bcrypt.compare(text1, text2);
  return result;
};

const checkLogin = async (request, response, next) => {
  try {
    let token;
    if (
      !request.headers.authorization ||
      !request.headers.authorization.startsWith("Bearer")
    ) {
      throw new HttpError("No authentication token found", 404);
    }

    token = request.headers.authorization.split(" ")[1];
    if (!token) {
      throw new HttpError("Invalid token", 400);
    }
    const decodedToken = jwt.verify(token, process.env.JWTSECRET);

    if (!decodedToken.id) throw new HttpError("Invalid token", 422);

    let user = await User.findById(decodedToken.id).select("-password");

    if (!user) throw new HttpError("Unauthorized", 402);
    request.userdata = user;
    request.userId = user._id.toString();
    next();
  } catch (error) {
    console.log(`Authentication error, ERROR : ${error.message}`);
    response
      .status(error.code)
      .json({ message: "Authentication error", error: error.message });
  }
};

module.exports = {
  generateToken,
  generateHash,
  verifyPassword,
  checkLogin,
};
