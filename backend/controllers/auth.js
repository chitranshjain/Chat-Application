const { HttpError, errorHandler } = require("../utils/error");
const User = require("../models/user");
const shortid = require("shortid");
const { uploadFileUtility } = require("../utils/file-upload-utility");
const {
  generateHash,
  generateToken,
  verifyPassword,
} = require("../utils/auth-utility");

const register = async (request, response) => {
  try {
    const { name, phoneNumber, email, password, confirmPassword } =
      request.body;

    if (!name || !phoneNumber || !email || !password || !confirmPassword) {
      throw new HttpError("A field is missing", 400);
    }

    const image = request.file;

    const userExists = await User.findOne({ email: email });
    if (userExists) {
      throw new HttpError(
        "A user with the given email already exists, please register using a different email address",
        400
      );
    }

    if (password !== confirmPassword) {
      throw new HttpError("The entered passwords do not match", 400);
    }

    const imageUrl = await uploadFileUtility(image, "User", shortid.generate());
    const hashedPassword = await generateHash(password);
    const newUser = new User({
      name,
      phoneNumber,
      email,
      password: hashedPassword,
      imageUrl,
    });

    await newUser.save();

    const token = generateToken(newUser._id);

    response
      .status(201)
      .json({ message: "Account created successfully", token });
  } catch (error) {
    errorHandler(error, response);
  }
};

const login = async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      throw new HttpError("A field is missing", 400);
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new HttpError("Invalid email address", 400);
    }

    if (!(await verifyPassword(password, user.password))) {
      throw new HttpError("Incorrect password", 400);
    }

    const token = generateToken(user._id);

    //set up cookie
    response.cookie("jwtoken", token, {
      httpOnly: false,
      expires: new Date(Date.now() + 2589200000),
    });

    response.status(200).json({ message: "Signed In Successfully", token });
  } catch (error) {
    errorHandler(error, response);
  }
};

module.exports = { register, login };
