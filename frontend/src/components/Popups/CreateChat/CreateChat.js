import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import { makePostAPICall } from "../../../utils/api.js";
import CreateChatAutoComplete from "./CreateChatAutoComplete.js";
import { UserContext } from "../../../Context/UserContext.js";
import { reactLocalStorage } from "reactjs-localstorage";
import { toast } from "react-toastify";

export default function CreateChat() {
  const [open, setOpen] = React.useState(false);
  const [isGroupChat, setIsGroupChat] = React.useState(false);
  const [groupChatName, setGroupChatName] = React.useState("");
  const [createChatWith, setCreateChatWith] = React.useState([]);

  const { getUserChats } = React.useContext(UserContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //fetch selected users for chat
  const handleCreateChatWith = (data) => {
    if (data.length > 1 && !isGroupChat) {
      toast.error("Please mark as a Group Chat to add more members");
      return;
    } else {
      setCreateChatWith(data);
    }
  };

  const getUsersID = (data) => {
    let res = [];
    for (let item of data) {
      res.push(item._id);
    }
    return res;
  };

  const onSubmitCreateChat = async () => {
    const users = getUsersID(createChatWith);
    // const isGroup = users.length === 1 ? false : true;
    // const grpName = isGroup === false ? `${user.name}` : "New Group";
    const token = reactLocalStorage.get("chatAppAuthToken", true);
    const headers = { Authorization: `Bearer ${token}` };

    const payload = {
      isGroupChat: isGroupChat,
      users: users,
      chatName: groupChatName,
    };

    await makePostAPICall("http:///localhost:8000/api/chat/", headers, payload);

    getUserChats();
    setOpen(false);
  };

  const handleChange = (event) => {
    setGroupChatName(event.target.value);
  };

  return (
    <div>
      <Button
        variant="secondary"
        className="my-4 mx-4"
        size="lg"
        onClick={handleClickOpen}
        style={{ border: "1px white solid" }}
      >
        Create new chat
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Create A New Chat</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    value={isGroupChat}
                    onClick={() => {
                      setIsGroupChat((prev) => !prev);
                    }}
                  />
                }
                label="Group Chat"
              />
            </FormGroup>
            {isGroupChat && (
              <TextField
                style={{ marginBottom: "8px", width: "100%" }}
                id="outlined-basic"
                label="Group Name"
                variant="outlined"
                value={groupChatName}
                onChange={handleChange}
              />
            )}
            <CreateChatAutoComplete
              handleCreateChatWith={handleCreateChatWith}
              isGroupChat={isGroupChat}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={onSubmitCreateChat} autoFocus>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
