import React, { useCallback, useContext, useEffect, useState } from "react";
import MessagePanelInput from "../MessagePanelInput/MessagePanelInput.js";
import MessageChatArea from "../MessageChatArea/MessageChatArea.js";
import { UserContext } from "../../../Context/UserContext";
import { makeGetAPICall, makePostAPICall } from "../../../utils/api";
import { reactLocalStorage } from "reactjs-localstorage";
import "./MessageWindow.css";

function MessageWindow({ socket }) {
  const { selectedChat } = useContext(UserContext);

  const [chat, setChat] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [lastTransaction, setLastTransaction] = useState();
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Get details of this chat
  const getChatDetails = useCallback(async () => {
    setMessages();
    const token = reactLocalStorage.get("chatAppAuthToken");
    const data = await makeGetAPICall(
      `http://localhost:8000/api/chat/${selectedChat}`,
      { Authorization: `Bearer ${token}` }
    );
    setChat(data.chat);
  }, [selectedChat]);

  // Get all messages for this chat for the first time
  const getChatMessages = useCallback(async () => {
    const token = reactLocalStorage.get("chatAppAuthToken");
    const data = await makeGetAPICall(
      `http://localhost:8000/api/message/${selectedChat}`,
      { Authorization: `Bearer ${token}` }
    );
    setLastTransaction(data.messages[data.messages.length - 1]);
    buildMessages(data.messages, []);
    // createSeenMessageTransaction();
  }, [selectedChat]);

  // Fetch pending transactions after the last processed transaction
  const fetchPendingTransactions = useCallback(async () => {
    const token = reactLocalStorage.get("chatAppAuthToken");
    if (!lastTransaction) return;
    const data = await makeGetAPICall(
      `http://localhost:8000/api/message/${selectedChat}/${lastTransaction._id}`,
      { Authorization: `Bearer ${token}` }
    );

    setLastTransaction(data.transactions[data.transactions.length - 1]);
    buildMessages(data.transactions, messages);
  }, [selectedChat, lastTransaction]);

  // TODO : complete remaining socket io logic typing, stop-typing, and Transaction
  useEffect(() => {
    getChatDetails();
    getChatMessages();
    socket.emit("join chat", selectedChat);
  }, [selectedChat, getChatDetails, getChatMessages, socket]);

  useEffect(() => {
    socket.on("transaction", (newTransaction) => {
      if (newTransaction.chat._id === selectedChat) {
        getChatMessages();
      }
    });

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, [socket, fetchPendingTransactions, selectedChat]);

  // Handle input of message and emit typing event
  const handleChange = (event) => {
    event.preventDefault();
    setNewMessage(event.target.value);

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat);
        setTyping(false);
      }
    }, timerLength);
  };

  // Create a NEW message transaction
  const sendMessage = async (event) => {
    event.preventDefault();
    const token = reactLocalStorage.get("chatAppAuthToken");
    const data = await makePostAPICall(
      "http://localhost:8000/api/message/",
      {
        Authorization: `Bearer ${token}`,
      },
      {
        message: newMessage,
        chatId: selectedChat,
        transactionType: "NEW",
      }
    );

    setNewMessage("");
    socket.emit("new transaction", data.transaction);
  };

  // Create an EDIT message transaction
  const editMessage = async (messageId, newContent) => {
    const token = reactLocalStorage.get("chatAppAuthToken");
    const data = await makePostAPICall(
      "http://localhost:8000/api/message/",
      {
        Authorization: `Bearer ${token}`,
      },
      {
        chatId: selectedChat,
        transactionType: "EDIT",
        messageId: messageId,
        message: newContent,
      }
    );

    socket.emit("new transaction", data.transaction);
  };

  // Create a DELETE message transaction
  const deleteMessage = async (messageId) => {
    const token = reactLocalStorage.get("chatAppAuthToken");
    const data = await makePostAPICall(
      "http://localhost:8000/api/message/",
      {
        Authorization: `Bearer ${token}`,
      },
      {
        chatId: selectedChat,
        transactionType: "DELETE",
        messageId: messageId,
      }
    );

    socket.emit("new transaction", data.transaction);
  };

  // Logic to update the UI by processing the transactions
  const buildMessages = (newTransactions, oldMessages) => {
    let trans = newTransactions;
    let msgs = [...oldMessages];

    for (let tran of trans) {
      if (tran.transactionType === "NEW") msgs.push(tran);
      else if (tran.transactionType !== "SEEN") {
        let index = msgs.findIndex((msg) => msg._id === tran.messageId);
        // console.log(index);
        if (index === -1) continue;
        if (tran.transactionType === "DELETE") msgs.splice(index, 1);
        else if (tran.transactionType === "EDIT") msgs[index] = tran;
      } else if (tran.transactionType === "SEEN") {
        for (let msg of msgs) {
          if (msg.seenBy.includes(tran.sender._id)) continue;
          else msg.seenBy.push(tran.sender);
        }
      }
    }

    setMessages(msgs);
  };

  return (
    <div className="message_window">
      {chat && messages && (
        <>
          <MessageChatArea
            chat={chat}
            messages={messages}
            deleteMessage={deleteMessage}
            editMessage={editMessage}
            isTyping={isTyping}
            getChatDetails={getChatDetails}
          />
          <MessagePanelInput
            newMessage={newMessage}
            handleChange={handleChange}
            sendMessage={sendMessage}
          />
        </>
      )}
    </div>
  );
}

export default MessageWindow;
