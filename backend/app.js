// Package Imports
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const socketio = require("socket.io");

const { initializeApp } = require("firebase/app");
const { firebaseConfig } = require("./utils/firebase-config");

const { connectDB } = require("./db/index");

// Routes Imports
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");
const messageRoutes = require("./routes/message");

const User = require("./models/user");

const app = express();
dotenv.config();
connectDB();

const connectedUsers = [];
const socketToUserMap = {};

// Third party middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());

initializeApp(firebaseConfig);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// SOCKET.IO IMPLEMENTATION LEFT, WILL BE WORKING ON IT NEXT
// COMPLETED THE ROUTES MENTIONED IN THE DOCUMENTATION.
// IF ANY MORE ARE NEEDED, CREATE A NEW REQUIRED.JS FILE AND MENTION WHAT FUNCTIONALITY IS NEEDED, WILL DO THAT.
// IF NEED CHANGES IN ANY OF THE CONTROLLERS, PLEASE MAKE A CHANGES.JS FILE AND MENTION CHANGES NEEDED, WILL IMPLEMENT THOSE.
// ALSO ADDED POSTMAN COLLECTION FILE FOR YOUR HELP
// PLEASE LET ME KNOW WHAT I NEED TO DO IN THE FRONTEND, I WILL WORK ON THAT

// SOCKET IO WORK DONE, ADDED A HELPER FILE FOR THE EVENTS THAT I HAVE DESIGNED
// IF YOU NEED MORE OR WANT TO CHANGE ANY, PLEASE LET ME KNOW

let server = app.listen(process.env.PORT || 8000, () => {
  console.log("Server is up and running on PORT " + process.env.PORT || 8000);
});

const io = socketio(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (userId) => {
    if (userId) {
      socket.join(userId);
      console.log(`User joined his room ${userId}`);
      connectedUsers.push(userId);
      socketToUserMap[socket.id] = userId;
      socket.broadcast.emit("users", connectedUsers);
    }
  });

  socket.on("join chat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("typing", (chatId) => {
    socket.in(chatId).emit("typing");
  });

  socket.on("stop typing", (chatId) => {
    socket.in(chatId).emit("stop typing");
  });

  socket.on("new transaction", (newTransaction) => {
    var chat = newTransaction.chat;

    if (!chat.users) return console.log("chat.users not defined");

    io.in(chat._id).emit("transaction", newTransaction);
  });

  socket.on("disconnect", async () => {
    const userId = socketToUserMap[socket.id];
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $set: {
          lastSeen: Date.now(),
        },
      });
      let index = connectedUsers.findIndex((id) => id === userId);
      connectedUsers.splice(index, 1);
      socket.broadcast.emit("users", connectedUsers);
    }
  });
});
