# Events

- ## Setup

  ### Event - "setup"

  Whenever you initiate a socket connection in the frontend, emit this event and send the logged in user's id as the data, this event will be used to update the online/offline status of the user.

  ```javascript
  socket.on("setup", (userId) => {
    socket.join(userId);
    connectedUsers.push(userId);
    socketToUserMap.set(socket.id, userId);
    socket.emit("users", connectedUsers);
  });
  ```

  connectedUsers is an array of user IDs of all the users who are currently connected and socketToUserMap is a Hashmap where the key is the socket ID and the value is the user ID. Whenever a new user gets connected, we emit a new event which sends the list of users currently connected.

- ## Users

  ### Event - "users"

  Whenever a new user is added to the list of currently connected users, we emit this event and send the list of connected users as data.

  ```javascript
  socket.on("setup", (userId) => {
    socket.join(userId);
    connectedUsers.push(userId);
    socketToUserMap.set(socket.id, userId);
    socket.emit("users", connectedUsers);
  });
  ```

  connectedUsers is an array of user IDs of all the users who are currently connected and to check whether a user is currently online or not just check if this array contains the user ID of that user or not. If it is present, the user is online else offline.

- ## Join Chat

  ### Event - "join chat"

  This event will be used to join a room for a specific chat. Whenever you fetch the messages for a specific chat in the frontend, emit the "join chat" event and send the chatId of that chat as the data. We will connect the user to that chat room and all the related events will be emitted in the room which can be used in the frontend to update the UI in realtime.

  ```javascript
  socket.on("join chat", (chatId) => {
    socket.join(chatId);
  });
  ```

- ## Typing

  ### Event - "typing"

  This event will be used to handle the typing event in the chat room. Whenever a user starts typing, emit this event and send the chat ID of the chat in which the user is typing, we will emit a typing event in the room of that chat.

  ```javascript
  socket.on("typing", (chatId) => {
    socket.in(chatId).emit("typing");
  });
  ```

  Whenever you receive this event in the frontend, display a typing indicator

- ## Stop Typing

  ### Event - "stop typing"

  This event will be used to handle the typing event in the chat room. Whenever a user stops typing, emit this event and send the chat ID of the chat in which the user is typing, we will emit a the same event in the room of that chat.

  ```javascript
  socket.on("stop typing", (chatId) => {
    socket.in(chatId).emit("stop typing");
  });
  ```

  Whenever you receive this event in the frontend, stop displaying the typing indicator

- ## New Transaction

  ### Event - "new transaction"

  Whenever you create a new transaction, emit this event and send along with it the transaction received in the response of the API call. We will use this transaction to emit the transaction to all the associated users.

  ```javascript
  socket.on("new transaction", (newTransaction) => {
    var chat = newTransaction.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      socket.in(user._id).emit("transaction", newTransaction);
    });
  });
  ```

- ## Transaction

  ### Event - "transaction"

  Whenever you receive this event, process this transaction according to its type.

  ```javascript
  socket.in(user._id).emit("transaction", newTransaction);
  ```
