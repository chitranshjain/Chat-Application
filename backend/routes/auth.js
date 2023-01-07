const express = require("express");
const { imageUpload } = require("../utils/file-upload-utility");
const { register, login, getUserData } = require("../controllers/auth");
const router = express.Router();

router.post("/register", imageUpload().single("image"), register);
router.post("/login", login);

module.exports = router;
