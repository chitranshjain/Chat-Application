import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import { makePostAPICall } from "../../utils/api";
import { reactLocalStorage } from "reactjs-localstorage";
import { UserContext } from "../../Context/UserContext";

function Signup() {
  const { getUserData } = useContext(UserContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleformsubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("name", name);
    payload.append("phoneNumber", phoneNumber);
    payload.append("email", email);
    payload.append("image", image);
    payload.append("password", password);
    payload.append("confirmPassword", confirmPassword);
    const data = await makePostAPICall(
      "http://localhost:8000/api/auth/register/",
      {},
      payload
    );

    reactLocalStorage.set("chatAppAuthToken", data.token);
    await getUserData();
    navigate("/chat");
  };

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" method="POST" enctype="multipart/form-data">
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign Up</h3>

          <div className="form-group mt-3">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control mt-1"
              placeholder="e.g Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group mt-3">
            <label>Phone Number</label>
            <input
              type="number"
              className="form-control mt-1"
              placeholder="ex:- 7008788033"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="form-group mt-3">
            <label>Upload Image</label>
            <input
              type="file"
              className="form-control mt-1"
              placeholder="select profile pic"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group mt-3">
            <label>Confirm Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="d-grid gap-2 mt-3">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={(e) => handleformsubmit(e)}
            >
              Sign up
            </button>
          </div>
          {/* <p className="text-center mt-2">
            Forgot <a href="#">password?</a>
          </p> */}
          <div className="text-center mt-2">
            {" "}
            Already registered?{" "}
            <span className="link-primary">
              <Link to="/signin"> Sign In </Link>{" "}
            </span>{" "}
          </div>
        </div>
      </form>
    </div>
  );
}

export default Signup;
