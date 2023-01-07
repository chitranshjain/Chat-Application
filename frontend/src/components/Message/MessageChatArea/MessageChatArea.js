import React, { useContext, useEffect } from "react";
import "./MessageChatArea.css";
import Card from "react-bootstrap/Card";
import Avatar from "@mui/material/Avatar";
import CircleIcon from "@mui/icons-material/Circle";
import MessageChat from "../MessageChat/MessageChat.js";
import { UserContext } from "../../../Context/UserContext";
import Lottie from "react-lottie";
import animationData from "../../../Assets/typing.json";
import GroupDetails from "../../Popups/GroupDetails/GroupDetails.js";
function MessageChatArea({
  chat,
  messages,
  deleteMessage,
  editMessage,
  isTyping,
  getChatDetails,
}) {
  const { user, onlineUsers } = useContext(UserContext);

  const handleNewMessage = () => {
    let container = document.getElementsByClassName(
      "message_chat_area_card_body"
    );
    container[0].scrollTop = container[0].scrollHeight;
  };

  useEffect(() => {
    handleNewMessage();
  }, [messages]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const getOtherUser = (users) => {
    if (users[0]._id === user._id) {
      return users[1];
    } else {
      return users[0];
    }
  };

  return (
    <div className="message_chat_area">
      {chat && (
        <Card className="message_chat_area_card">
          {/* TODO : Clicking on the chat header must open a modal that displays chat details such as the members and if it is a group chat, there should be options to add or remove a member */}
          <Card.Header className="message_chat_area_card_header">
            {chat.isGroupChat ? (
              <>
                <GroupDetails getChatDetails={getChatDetails} chat={chat} />
              </>
            ) : (
              <Avatar
                className="item"
                sx={{ width: 25, height: 25 }}
                src={`${
                  chat.users[0]._id === user._id
                    ? chat.users[1].imageUrl
                    : chat.users[0].imageUrl
                }`}
              />
            )}
            <p className="h5 item">
              {chat.isGroupChat
                ? chat.chatName
                : chat.users[0]._id === user._id
                ? chat.users[1].name
                : chat.users[0].name}
            </p>
            {!chat.isGroupChat &&
            onlineUsers.includes(getOtherUser(chat.users)._id) ? (
              <CircleIcon
                className="item  live"
                sx={{ fontSize: "10px", color: "green" }}
              />
            ) : (
              <></>
            )}
          </Card.Header>
          <Card.Body className="message_chat_area_card_body">
            {messages && messages.length > 0 ? (
              messages.map((message, index) => {
                return (
                  <MessageChat
                    key={index}
                    editMessage={editMessage}
                    deleteMessage={deleteMessage}
                    message={message}
                    chat={chat}
                  />
                );
              })
            ) : (
              <center>
                <p>No messages</p>
              </center>
            )}
            {isTyping ? (
              <div>
                <Lottie
                  options={defaultOptions}
                  width={70}
                  style={{
                    marginBottom: "12px",
                    marginLeft: 0,
                    marginTop: "12px",
                  }}
                />
              </div>
            ) : (
              <></>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default MessageChatArea;
