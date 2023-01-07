import React, { useContext } from "react";
import "./Header.css";
import LogoutIcon from "@mui/icons-material/Logout";
import { UserContext } from "../../Context/UserContext";

function Header() {
  const { signOut } = useContext(UserContext);
  return (
    <div className="header">
      <div className="header_left">
        <p className="h5">Chatify</p>
      </div>
      <div className="header_right">
        <LogoutIcon onClick={signOut} />
      </div>
    </div>
  );
}

export default Header;
