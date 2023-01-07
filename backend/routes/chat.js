const express = require("express");
const { checkLogin } = require("../utils/auth-utility");
const {
  createChat,
  renameChat,
  addUserToGroupChat,
  removeUserFromGroupChat,
  deleteAChat,
  getChatsOfCurrentUser,
  getChatById,
  pinChat,
  unpinChat,
} = require("../controllers/chat");

const router = express.Router();

router.get("/", checkLogin, getChatsOfCurrentUser);
router.get("/:chatId", checkLogin, getChatById);

router.post("/", checkLogin, createChat);
router.post("/pin/:chatId", checkLogin, pinChat);
router.post("/unpin/:chatId", checkLogin, unpinChat);

router.patch("/rename/:chatId", checkLogin, renameChat);
router.patch("/add/:chatId", checkLogin, addUserToGroupChat);
router.patch("/remove/:chatId", checkLogin, removeUserFromGroupChat);

router.delete("/:chatId", checkLogin, deleteAChat);

module.exports = router;
