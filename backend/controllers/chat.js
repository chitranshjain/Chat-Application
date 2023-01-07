const { default: mongoose } = require("mongoose");
const Chat = require("../models/chats");
const User = require("../models/user");
const Message = require("../models/message");
const { errorHandler, HttpError } = require("../utils/error");

// This controller creates a new chat
const createChat = async (request, response) => {
  try {
    const { users, isGroupChat } = request.body;
    let chatName, groupAdmin;
    if (isGroupChat) {
      chatName = request.body.chatName;
      groupAdmin = request.userId;
    }

    const userId = request.userId;
    users.push(userId);

    const newChat = new Chat({
      users: users,
      isGroupChat: isGroupChat,
      chatName: chatName,
      groupAdmin: groupAdmin,
    });

    const session = await mongoose.startSession();
    session.startTransaction({ session: session });
    await newChat.save({ session: session });
    await User.updateMany(
      { _id: { $in: users } },
      {
        $push: {
          otherChats: newChat,
        },
      },
      { session: session }
    );
    await session.commitTransaction();

    response
      .status(201)
      .json({ message: "Chat created successfully", chat: newChat });
  } catch (error) {
    errorHandler(error, response);
  }
};

// This controller will be used to rename a group chat
const renameChat = async (request, response) => {
  try {
    const chatId = request.params.chatId;
    const userId = request.userId;

    let chat = await Chat.findById(chatId);
    if (!chat) {
      throw new HttpError("No chat found", 404);
    }

    if (!chat.isGroupChat) {
      throw new HttpError("The chat is not a group chat", 400);
    }

    if (!chat.users.includes(request.userId)) {
      throw new HttpError(
        "Unauthorized, you are not allowed to change the name of the group you are not a part of",
        402
      );
    }

    chat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $set: {
          chatName: request.body.chatName,
        },
      },
      { new: true }
    );

    response.status(200).json({ message: "Chat renamed successfully", chat });
  } catch (error) {
    errorHandler(error, response);
  }
};

// This controller adds a new user to a group chat
const addUserToGroupChat = async (request, response) => {
  try {
    const { chatId } = request.params;
    const userId = request.userId;

    let chat = await Chat.findById(chatId);
    if (!chat) {
      throw new HttpError("No chat found", 404);
    }

    if (!chat.isGroupChat) {
      throw new HttpError("Users can only be added to a group chat", 400);
    }

    if (chat.groupAdmin.toString() !== userId.toString()) {
      throw new HttpError("Only admins can add new members", 400);
    }

    const session = await mongoose.startSession();
    session.startTransaction({ session: session });
    chat.users.push(request.body.user);
    await chat.save({ session: session });
    await User.findByIdAndUpdate(
      request.body.user,
      {
        $push: {
          otherChats: chat,
        },
      },
      { session: session }
    );
    await session.commitTransaction();

    response
      .status(200)
      .json({ message: "User added successfully", chat: chat });
  } catch (error) {
    errorHandler(error, response);
  }
};

// This controller removes a user from a group chat
const removeUserFromGroupChat = async (request, response) => {
  try {
    const { chatId } = request.params;
    const userId = request.userId;

    let chat = await Chat.findById(chatId);
    if (!chat) {
      throw new HttpError("No chat found", 404);
    }

    if (!chat.isGroupChat) {
      throw new HttpError("Users can only be added to a group chat", 400);
    }

    if (chat.groupAdmin.toString() !== userId.toString()) {
      throw new HttpError("Only admins can remove members", 400);
    }

    if (!chat.users.includes(request.body.user)) {
      throw new HttpError("User is not a member of the group chat", 400);
    }

    let user = await User.findById(request.body.user);

    const session = await mongoose.startSession();
    session.startTransaction({ session: session });
    chat.users.pull(request.body.user);
    await chat.save({ session: session });
    if (user.pinnedChats.includes(chat)) user.pinnedChats.pull(chat);
    else user.otherChats.pull(chat);
    await user.save({ session: session });
    await session.commitTransaction();

    response
      .status(200)
      .json({ message: "User removed successfully", chat: chat });
  } catch (error) {
    errorHandler(error, response);
  }
};

// This controller deletes a chat
const deleteAChat = async (request, response) => {
  try {
    const chatId = request.params.chatId;
    const userId = request.userId;

    let chat = await Chat.findById(chatId);

    if (!chat.users.includes(userId)) {
      throw new HttpError(
        "Unauthorized, only participants of a chat are allowed to delete it",
        402
      );
    }

    let user = await User.findById(userId);

    const session = await mongoose.startSession();
    session.startTransaction({ session: session });
    await chat.remove({ session: session });
    await User.updateMany(
      { _id: { $in: chat.users } },
      {
        $pull: {
          pinnedChats: chatId,
          otherChats: chatId,
        },
      },
      { session: session }
    );
    await Message.deleteMany({ chat: chat }, { session: session });
    session.commitTransaction();

    response.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    errorHandler(error, response);
  }
};

// This controller fetches all the chats of currently logged in user
const getChatsOfCurrentUser = async (request, response) => {
  try {
    const userId = request.userId;

    const user = await User.findById(userId);

    const pinnedChats = await Chat.find({ _id: { $in: user.pinnedChats } })
      .populate("users")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          model: "User",
        },
      });

    const otherChats = await Chat.find({ _id: { $in: user.otherChats } })
      .populate("users")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          model: "User",
        },
      });

    response
      .status(200)
      .json({ message: "Chats fetched successfully", pinnedChats, otherChats });
  } catch (error) {
    errorHandler(error, response);
  }
};

//This controller fetches a specific chat
const getChatById = async (request, response) => {
  try {
    const { chatId } = request.params;
    const chat = await Chat.findById(chatId)
      .populate("users")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          model: "User",
        },
      });

    response
      .status(200)
      .json({ message: "Chat fetched successfully", chat: chat });
  } catch (error) {
    errorHandler(error, response);
  }
};

// This controller pins a chat
const pinChat = async (request, response) => {
  try {
    const chatId = request.params.chatId;
    const userId = request.userId;

    let user = await User.findById(userId);
    user.otherChats.pull(chatId);
    user.pinnedChats.push(chatId);
    await user.save();

    response.status(200).json({ message: "Chat pinned successfully" });
  } catch (error) {
    errorHandler(error, response);
  }
};

// This controller unpins a chat
const unpinChat = async (request, response) => {
  try {
    const chatId = request.params.chatId;
    const userId = request.userId;

    let user = await User.findById(userId);
    user.otherChats.push(chatId);
    user.pinnedChats.pull(chatId);
    await user.save();

    response.status(200).json({ message: "Chat unpinned successfully" });
  } catch (error) {
    errorHandler(error, response);
  }
};

module.exports = {
  createChat,
  renameChat,
  addUserToGroupChat,
  removeUserFromGroupChat,
  deleteAChat,
  getChatsOfCurrentUser,
  getChatById,
  pinChat,
  unpinChat,
};
