import React, { useContext } from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import PushPinIcon from "@mui/icons-material/PushPin";
import { UserContext } from "../../Context/UserContext";
import { reactLocalStorage } from "reactjs-localstorage";
import { makeDeleteAPICall, makePostAPICall } from "../../utils/api";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { toast } from "react-toastify";

function DirectListView({ chats }) {
  const { user, setSelectedChat, getUserChats } = useContext(UserContext);

  const pinChat = async (chatId) => {
    const token = reactLocalStorage.get("chatAppAuthToken");
    await makePostAPICall(
      `http://localhost:8000/api/chat/pin/${chatId}`,
      { Authorization: `Bearer ${token}` },
      {}
    );
    getUserChats();
    toast.success("Chat Pinned");
  };

  const deleteChat = async (chatId) => {
    const token = reactLocalStorage.get("chatAppAuthToken");
    await makeDeleteAPICall(
      `http://localhost:8000/api/chat/${chatId}`,
      { Authorization: `Bearer ${token}` },
      {}
    );

    getUserChats();
    toast.success("Chat Deleted");
  };

  return (
    chats &&
    chats.map((chat) => {
      return (
        <div
          key={chat._id}
          onClick={() => {
            setSelectedChat(chat._id);
          }}
        >
          <ListItemButton sx={{ pl: 4 }}>
            {/* <ListItemAvatar>
            <Avatar src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50" />
          </ListItemAvatar> */}
            <ListItemText
              primary={`${
                chat.isGroupChat
                  ? chat.chatName
                  : chat.users[0]._id === user._id
                  ? chat.users[1].name
                  : chat.users[0].name
              }`}
            />
            <PushPinIcon
              sx={{ color: "white" }}
              onClick={(event) => {
                pinChat(chat._id);
                event.stopPropagation();
              }}
            />

            <DeleteOutlineIcon
              sx={{ color: "white", marginLeft: "6px" }}
              onClick={(event) => {
                deleteChat(chat._id);
                event.stopPropagation();
              }}
            />
          </ListItemButton>
        </div>
      );
    })
  );
}

export default DirectListView;
