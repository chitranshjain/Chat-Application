const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    lastSeen: {
      type: Date,
      default: Date.now(),
    },
    pinnedChats: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Chat",
        default: [],
      },
    ],
    otherChats: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Chat",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
