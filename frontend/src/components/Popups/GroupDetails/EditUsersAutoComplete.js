import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { UserContext } from "../../../Context/UserContext.js";
import Button from "@mui/material/Button";
import { makePatchAPICall } from "../../../utils/api";
import { reactLocalStorage } from "reactjs-localstorage";
import { toast } from "react-toastify";

export default function EditUsersAutoComplete({
  chat,
  handleClose,
  getChatDetails,
}) {
  const { otherUsers } = React.useContext(UserContext);

  React.useEffect(() => {}, [chat]);

  const allOtherUsers = () => {
    let presentUsers = chat.users.map((user) => user._id);
    let result = otherUsers.filter((user) => !presentUsers.includes(user._id));
    return result;
  };

  const [toAddMembers, setToAddMembers] = React.useState();

  const addMembers = async () => {
    let token = reactLocalStorage.get("chatAppAuthToken");
    if (!token) return;

    if (!toAddMembers) {
      toast.error("No members to add");
      return;
    }

    const url = `http://localhost:8000/api/chat/add/${chat._id}`;
    const header = {
      Authorization: `Bearer ${token}`,
    };
    const data = {
      user: toAddMembers,
    };

    const response = await makePatchAPICall(url, header, data);
    toast.success(response.message);
    setToAddMembers();
    getChatDetails();
    handleClose();
  };

  return (
    <>
      <Autocomplete
        id="Edit users auto complete"
        sx={{ width: "100%", marginTop: "6px" }}
        options={allOtherUsers()}
        autoHighlight
        multiple={false}
        onChange={(event, value) => setToAddMembers(value)}
        getOptionLabel={(option) => option.name}
        renderOption={(props, option) => (
          <Box
            component="li"
            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
            {...props}
          >
            <img loading="lazy" width="20" src={option.imageUrl} alt="" />
            {option.name} ({option.email}) +{option.phoneNumber}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Add members"
            inputProps={{
              ...params.inputProps,
              autoComplete: "new-password", // disable autocomplete and autofill
            }}
          />
        )}
      />
      <Button
        sx={{ width: "100%", marginTop: "12px" }}
        color="success"
        onClick={addMembers}
      >
        Add Members
      </Button>
      <hr />
    </>
  );
}
