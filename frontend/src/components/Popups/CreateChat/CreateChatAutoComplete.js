import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { UserContext } from "../../../Context/UserContext.js";

export default function CreateChatAutoComplete({
  handleCreateChatWith,
  isGroupChat,
}) {
  const { otherUsers } = React.useContext(UserContext);

  return (
    <Autocomplete
      id="country-select-demo"
      sx={{ width: 300 }}
      options={otherUsers}
      autoHighlight
      multiple={true}
      onChange={(event, value) => handleCreateChatWith(value)}
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
          label="Choose users to send message"
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password", // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
}
