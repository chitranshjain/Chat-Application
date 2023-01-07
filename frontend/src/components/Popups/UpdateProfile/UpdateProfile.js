import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import EditIcon from "@mui/icons-material/Edit";
import Form from "react-bootstrap/Form";
import { UserContext } from "../../../Context/UserContext";
import { reactLocalStorage } from "reactjs-localstorage";
import { makePatchAPICall } from "../../../utils/api";

export default function UpdateProfile() {
  const { user, getUserData } = React.useContext(UserContext);
  const [name, setName] = React.useState(user.name);
  const [phoneNumber, setPhoneNumber] = React.useState(user.phoneNumber);
  const [image, setImage] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const handleUpdateProfile = async () => {
    const token = reactLocalStorage.get("chatAppAuthToken");
    let payload;
    if (image) {
      payload = new FormData();
      payload.append("name", name);
      payload.append("phoneNumber", phoneNumber);
      payload.append("image", image);
    } else {
      payload = { name: name, phoneNumber: phoneNumber };
    }

    await makePatchAPICall(
      "http://localhost:8000/api/user/",
      { Authorization: `Bearer ${token}` },
      payload
    );

    await getUserData();
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <EditIcon onClick={handleClickOpen} style={{ marginLeft: "10px" }} />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Profile Pic</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </Form.Group>
            </Form>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleUpdateProfile} autoFocus>
            UpdateProfile
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
