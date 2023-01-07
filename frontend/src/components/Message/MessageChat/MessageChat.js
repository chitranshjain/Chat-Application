import React, { useContext } from "react";
import Card from "react-bootstrap/Card";
import Avatar from "@mui/material/Avatar";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import "./MessageChat.css";
import moment from "moment";
import { UserContext } from "../../../Context/UserContext";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditMessage from "../../Popups/EditMessage/EditMessage.js";

function MessageChat({ message, chat, deleteMessage, editMessage }) {
  const { user } = useContext(UserContext);
  return (
    <div className="message_chat">
      {message && (
        <Card className="message_chat_card">
          <Card.Header className="message_chat_header">
            <Avatar
              className="item"
              sx={{ width: 25, height: 25 }}
              src={message.sender.imageUrl}
            />
            <p className="h5 item"> {message.sender.name} </p>
            <p className="item h6">
              {moment(message.transactionTimestamp).format(
                "hh:mm A on DD MMM, YYYY"
              )}
            </p>
            {message.sender._id === user._id && (
              <div className="flex">
                <EditMessage
                  editMessage={editMessage}
                  message={message}
                  chat={chat}
                />
                <DeleteOutlineIcon
                  onClick={deleteMessage.bind(null, message._id)}
                  sx={{ marginLeft: "16px" }}
                />
              </div>
            )}
          </Card.Header>
          <Card.Body>
            <blockquote className="blockquote mb-0">
              <p className="message-content-p">{message.content}</p>
              {message.sender._id === user._id && (
                <div className="message_status">
                  {/* {message.seenBy.length}&nbsp;{chat.users.length} */}
                  {message.seenBy.length === chat.users.length ? (
                    <DoneAllIcon sx={{ color: "green" }} />
                  ) : (
                    <DoneAllIcon />
                  )}
                </div>
              )}
            </blockquote>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default MessageChat;
