import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import InfoIcon from "@mui/icons-material/Info";
import EditUsersAutoComplete from "./EditUsersAutoComplete.js";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { pink } from "@mui/material/colors";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { makePatchAPICall } from "../../../utils/api";
import { reactLocalStorage } from "reactjs-localstorage";
import { toast } from "react-toastify";
import { UserContext } from "../../../Context/UserContext.js";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function GroupDetails({ chat, getChatDetails }) {
  const { user } = React.useContext(UserContext);

  //Removing member logic
  const removeMember = async (MemberID) => {
    let token = reactLocalStorage.get("chatAppAuthToken");
    if (!token) return;

    const url = `http://localhost:8000/api/chat/remove/${chat._id}`;
    const header = {
      Authorization: `Bearer ${token}`,
    };
    const data = {
      user: MemberID,
    };

    const response = await makePatchAPICall(url, header, data);
    toast.success(response.message);
    getChatDetails();
    handleClose();
  };

  //* Modal open close logic
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <InfoIcon sx={{ marginRight: "30px" }} onClick={handleClickOpen} />

      <Dialog
        maxWidth="lg"
        PaperProps={{ sx: { width: "100%" } }}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{`Current Members`}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {chat.groupAdmin === user._id && (
                <EditUsersAutoComplete
                  getChatDetails={getChatDetails}
                  chat={chat}
                  handleClose={handleClose}
                />
              )}
              <List className="">
                {chat.users.map(function (item) {
                  return (
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src={item.imageUrl} />
                      </ListItemAvatar>
                      <ListItemText primary={item.name} sx={{ my: "auto" }} />
                      {chat.groupAdmin === user._id && item._id !== user._id ? (
                        <RemoveCircleOutlineIcon
                          sx={{ color: pink[500] }}
                          onClick={(e) => removeMember(item._id)}
                        />
                      ) : (
                        <></>
                      )}
                    </ListItem>
                  );
                })}
              </List>
            </Grid>
            <Grid item xs={4}></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
