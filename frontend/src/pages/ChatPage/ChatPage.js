import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar.js";
import MessageWindow from "../../components/Message/MessageWindow/MessageWindow.js";
import "./ChatPage.css";
import { UserContext } from "../../Context/UserContext.js";
import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:8000";
var socket;

function ChatPage() {
  const { loading, selectedChat, user, setOnlineUsers } =
    useContext(UserContext);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user._id);
    socket.on("connection", () => setSocketConnected(true));

    return () => {
      socket.off("setup", user._id);
    };
  }, [loading]);

  useEffect(() => {
    socket.on("users", (users) => {
      setOnlineUsers(users);
    });
  });

  if (loading) {
    return <center></center>;
  } else {
    return (
      <>
        {/* <Header /> */}
        <div className="app_body">
          <Sidebar />
          {selectedChat ? (
            <MessageWindow socket={socket} socketConnected={socketConnected} />
          ) : (
            <div
              style={{
                height: "400px",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <center>
                <h5>No Chat Selected</h5>
              </center>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default ChatPage;
