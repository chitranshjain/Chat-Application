const express = require("express");
const { checkLogin } = require("../utils/auth-utility");
const {
  createMessageTransaction,
  checkPendingTransactions,
  getMessagesByChatId,
  fetchPendingTransactions,
} = require("../controllers/message");

const router = express.Router();

router.get(
  "/transaction/:chatId/:transactionId",
  checkLogin,
  checkPendingTransactions
);
router.get("/:chatId", checkLogin, getMessagesByChatId);
router.get("/:chatId/:transactionId", checkLogin, fetchPendingTransactions);

router.post("/", checkLogin, createMessageTransaction);

module.exports = router;
