import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import "./Signin.css";
import { makePostAPICall } from "../../utils/api";
import { UserContext } from "../../Context/UserContext";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { getUserData } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const payload = {
      email: email,
      password: password,
    };
    const data = await makePostAPICall(
      "http://localhost:8000/api/auth/login",
      {},
      payload
    );

    reactLocalStorage.set("chatAppAuthToken", data.token);
    await getUserData();
    navigate("/chat");
  };

  return (
    <div className="Auth-form-container">
      <form className="Auth-form">
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign In</h3>
          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={(e) => handleLogin(e)}
            >
              Sign In
            </button>
          </div>
          <p className="forgot-password text-right mt-2">
            <a href="#">Forgot password?</a>
            <br /> New Here? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Signin;
