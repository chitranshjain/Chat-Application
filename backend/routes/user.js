const express = require("express");
const { checkLogin } = require("../utils/auth-utility");
const {
  checkAuthStatus,
  getAllUsers,
  updateUserProfile,
  updatePassword,
  getUserProfileById,
} = require("../controllers/user");
const { imageUpload } = require("../utils/file-upload-utility");

const router = express.Router();

router.get("/", checkLogin, checkAuthStatus);
router.get("/all", checkLogin, getAllUsers);
router.get("/:userId", checkLogin, getUserProfileById);

router.patch("/", checkLogin, imageUpload().single("image"), updateUserProfile);
router.patch("/password", checkLogin, updatePassword);

module.exports = router;
