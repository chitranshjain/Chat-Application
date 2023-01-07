const User = require("../models/user");
const { verifyPassword, generateHash } = require("../utils/auth-utility");
const { HttpError, errorHandler } = require("../utils/error");
const { uploadFileUtility } = require("../utils/file-upload-utility");
const shortid = require("shortid");

// This controller fetches the current user's profile and returns it
const checkAuthStatus = async (request, response) => {
  try {
    const userId = request.userId;
    const user = await User.findById(userId).select("-password");
    response
      .status(200)
      .json({ message: "User profile fetched successfully", userData: user });
  } catch (error) {
    errorHandler(error, response);
  }
};

// This controller fetches all other user profiles except the user requesting
const getAllUsers = async (request, response) => {
  try {
    const userId = request.userId;
    const users = await User.find({ _id: { $ne: userId } }).select("-password");

    response.status(200).json({ message: "Users fetched successfully", users });
  } catch (error) {
    errorHandler(error, response);
  }
};

// This controller updates user's profile
const updateUserProfile = async (request, response) => {
  try {
    const userId = request.userId;
    const { name, phoneNumber } = request.body;

    if (!name || !phoneNumber) {
      throw new HttpError("All fields are required", 400);
    }

    const image = request.file;
    const user = await User.findById(userId);
    let imageUrl = user.imageUrl;

    if (image) {
      imageUrl = await uploadFileUtility(image, "User", shortid.generate());
    }

    await User.findByIdAndUpdate(userId, {
      $set: {
        name,
        phoneNumber,
        imageUrl,
      },
    });

    response.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    errorHandler(error, response);
  }
};

// This controller updates currently logged in user's password
const updatePassword = async (request, response) => {
  try {
    const userId = request.userId;
    const { oldPassword, newPassword, confirmNewPassword } = request.body;
    const user = await User.findById(userId);

    if (!(await verifyPassword(oldPassword, user.password))) {
      throw new HttpError("Incorrect old password", 400);
    }

    if (newPassword !== confirmNewPassword) {
      throw new HttpError(
        "New password and confirm passwords do not match",
        400
      );
    }

    const hashedPassword = await generateHash(newPassword);

    await User.findByIdAndUpdate(userId, {
      $set: {
        password: hashedPassword,
      },
    });

    response.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    errorHandler(error, response);
  }
};

// This controller fetches profile of a user by his ID passed in params
const getUserProfileById = async (request, response) => {
  try {
    const { userId } = request.params;
    const user = await User.findById(userId);

    if (!user) {
      throw new HttpError("No user found with the given ID", 404);
    }

    response
      .status(200)
      .json({ message: "Profile fetched successfully", user });
  } catch (error) {
    errorHandler(error, response);
  }
};

module.exports = {
  checkAuthStatus,
  getAllUsers,
  updateUserProfile,
  updatePassword,
  getUserProfileById,
};
