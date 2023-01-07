const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
    },
    chat: {
      type: mongoose.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    transactionType: {
      type: String,
      enum: ["NEW", "EDIT", "DELETE", "SEEN"],
      default: "NEW",
      required: true,
    },
    messageId: {
      type: mongoose.Types.ObjectId,
      ref: "Message",
    },
    transactionTimestamp: {
      type: Date,
      default: Date.now(),
      required: true,
    },
    seenBy: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Message = mongoose.model("message", messageSchema);

module.exports = Message;
