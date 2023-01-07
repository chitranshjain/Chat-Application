import React, { useContext } from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { UserContext } from "../../Context/UserContext";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { makeDeleteAPICall, makePostAPICall } from "../../utils/api";
import { reactLocalStorage } from "reactjs-localstorage";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { toast } from "react-toastify";

function ChannelListView({ chats }) {
  const { user, setSelectedChat, getUserChats } = useContext(UserContext);

  const unpinChat = async (chatId) => {
    const token = reactLocalStorage.get("chatAppAuthToken");
    await makePostAPICall(
      `http://localhost:8000/api/chat/unpin/${chatId}`,
      { Authorization: `Bearer ${token}` },
      {}
    );
    getUserChats();
    toast.success("Chat Unpinned");
  };

  const deleteChat = async (chatId) => {
    const token = reactLocalStorage.get("chatAppAuthToken");
    await makeDeleteAPICall(
      `http://localhost:8000/api/chat/${chatId}`,
      { Authorization: `Bearer ${token}` },
      {}
    );

    getUserChats();
    setSelectedChat();
    toast.success("Chat Deleted");
  };

  return (
    chats &&
    chats.map((chat) => {
      return (
        <div
          key={chat._id}
          onClick={(event) => {
            setSelectedChat(chat._id);
          }}
        >
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText
              primary={`${
                chat.isGroupChat
                  ? chat.chatName
                  : chat.users[0]._id === user._id
                  ? chat.users[1].name
                  : chat.users[0].name
              }`}
            />
            <RemoveCircleOutlineIcon
              onClick={(event) => {
                unpinChat(chat._id);
                event.stopPropagation();
              }}
              sx={{ color: "white" }}
            />

            <DeleteOutlineIcon
              onClick={(event) => {
                deleteChat(chat._id);
                event.stopPropagation();
              }}
              sx={{ color: "white", marginLeft: "6px" }}
            />
          </ListItemButton>
        </div>
      );
    })
  );
}

export default ChannelListView;
