import React, { useContext } from "react";
import "./Sidebar.css";
import { Avatar } from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import CircularProgress from "@mui/material/CircularProgress";

//Importing icons
import PushPinIcon from "@mui/icons-material/PushPin";
import MessageIcon from "@mui/icons-material/Message";

//Importing components
import DirectListView from "../../components/DirectListView/DirectListView";
import ChannelListView from "../../components/ChannelListView/ChannelListView";

import { UserContext } from "../../Context/UserContext.js";
import CreateChat from "../Popups/CreateChat/CreateChat";
import UpdateProfile from "../Popups/UpdateProfile/UpdateProfile";

function Sidebar() {
  const { user, loading, pinnedChats, otherChats, signOut } =
    useContext(UserContext);

  // States to manage list opening and closing
  const [openChannel, setOpenChannel] = React.useState(true);
  const [openDirectMessage, setOpenDirectMessage] = React.useState(true);
  const handleClick = (from) => {
    if (from === "channels") {
      setOpenChannel(!openChannel);
    }
    if (from === "directmessage") {
      setOpenDirectMessage(!openDirectMessage);
    }
  };

  if (loading) {
    return (
      <center
        style={{ display: "block", marginLeft: "50%", marginTop: "auto" }}
      >
        <CircularProgress />
      </center>
    );
  } else {
    return (
      <div className="sidebar">
        <div className="sidebar_header">
          <h4>Chatify</h4>
          <LogoutIcon onClick={signOut} className="logout" />
        </div>
        <hr />
        {/* Profile Section */}
        <div className="profile">
          <Avatar
            className="header_avatar "
            sx={{ width: 32, height: 32 }}
            src={user.imageUrl}
          />
          <div className="mx-2">
            <p className="h5 flex">
              {user.name}
              <span>
                <UpdateProfile />
              </span>
            </p>{" "}
          </div>
        </div>
        {/* TODO : CREATE A BUTTON TO CREATE A NEW CHAT */}
        <CreateChat />
        <div className="chat">
          <List sx={{ width: "100%" }} component="nav">
            {/* channels  */}
            <ListItemButton onClick={(e) => handleClick("channels")}>
              <ListItemIcon>
                <PushPinIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Pinned Chats" />
              {openChannel ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={openChannel} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ChannelListView chats={pinnedChats} />
              </List>
            </Collapse>
            {/* End of channels */}

            {/* directmessage  */}
            <ListItemButton onClick={(e) => handleClick("directmessage")}>
              <ListItemIcon>
                <MessageIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Other Chats" />
              {openDirectMessage ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={openDirectMessage} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <DirectListView chats={otherChats} />
              </List>
            </Collapse>
            {/* End of directmessage */}
          </List>
        </div>
      </div>
    );
  }
}

export default Sidebar;
