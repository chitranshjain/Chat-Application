const Message = require("../models/message");
const Chat = require("../models/chats");
const { errorHandler, HttpError } = require("../utils/error");

// This controller creates a new message transaction
const createMessageTransaction = async (request, response) => {
  try {
    const { message, chatId, transactionType, messageId } = request.body;
    const userId = request.userId;

    let chat = await Chat.findById(chatId).populate("users");

    let transactionTimestamp;
    if (transactionType === "EDIT") {
      let oldMessage = await Message.findById(messageId);
      transactionTimestamp = oldMessage.transactionTimestamp;
    } else {
      transactionTimestamp = Date.now();
    }

    const newMessage = new Message({
      sender: userId,
      content: message,
      chat: chat,
      transactionType: transactionType,
      messageId: messageId,
      transactionTimestamp: transactionTimestamp,
    });

    await newMessage.save();
    transaction = await (await newMessage.populate("chat")).populate("sender");
    response.status(201).json({
      message: "Message transaction created successfully",
      transaction: transaction,
    });
  } catch (error) {
    errorHandler(error, response);
  }
};

// This controller checks whether any pending transactions are left to be processed after the last processed transaction
const checkPendingTransactions = async (request, response) => {
  try {
    const { chatId, transactionId } = request.params;
    const previousTransaction = await Message.findById(transactionId);
    if (!previousTransaction) {
      throw new HttpError("Previous transaction not found", 404);
    }

    const pendingTransactionCount = await Message.count({
      chat: chatId,
      transactionTimestamp: { $gt: previousTransaction.transactionTimestamp },
    });

    response.status(200).json({
      message: "Transaction status fetched successfully",
      unfetchedTransactions: pendingTransactionCount > 0 ? true : false,
    });
  } catch (error) {
    errorHandler(error, response);
  }
};

// This controller fetches all the messages for a chat ID
const getMessagesByChatId = async (request, response) => {
  try {
    const userId = request.userId;
    const { chatId } = request.params;

    const messages = await Message.find({ chat: chatId }).populate("sender");
    await Message.updateMany(
      {
        chat: chatId,
        seenBy: { $ne: userId },
      },
      {
        $push: {
          seenBy: userId,
        },
      }
    );

    response
      .status(200)
      .json({ message: "Messages fetched successfully", messages: messages });
  } catch (error) {
    errorHandler(error, response);
  }
};

// This controller fetches all the transactions after the last transaction
const fetchPendingTransactions = async (request, response) => {
  try {
    const userId = request.userId;
    const { chatId, transactionId } = request.params;
    const previousTransaction = await Message.findById(transactionId);
    if (!previousTransaction) {
      throw new HttpError("Previous transaction not found", 404);
    }

    const pendingTransactions = await Message.find({
      chat: chatId,
      transactionTimestamp: { $gt: previousTransaction.transactionTimestamp },
    })
      .populate("chat")
      .populate("sender");

    await Message.updateMany(
      {
        chat: chatId,
        transactionTimestamp: { $gt: previousTransaction.transactionTimestamp },
        seenBy: { $ne: userId },
      },
      {
        $push: {
          seenBy: userId,
        },
      }
    );

    response.status(200).json({
      message: "Transactions fetched successfully",
      transactions: pendingTransactions,
    });
  } catch (error) {
    errorHandler(error, response);
  }
};

module.exports = {
  createMessageTransaction,
  checkPendingTransactions,
  getMessagesByChatId,
  fetchPendingTransactions,
};
