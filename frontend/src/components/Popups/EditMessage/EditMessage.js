import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function EditMessage({ message, chat, editMessage }) {
  const [newMessage, setNewMessage] = React.useState(message.content);

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
      <EditIcon sx={{ marginLeft: "16px" }} onClick={handleClickOpen} />

      <Dialog
        maxWidth="lg"
        PaperProps={{ sx: { width: "100%", maxWidth: "720px!important" } }}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{`Update your message`}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            value={newMessage}
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setNewMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              editMessage(message._id, newMessage);
              setOpen(false);
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
