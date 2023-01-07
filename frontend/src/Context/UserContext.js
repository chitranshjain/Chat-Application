import React, { useState, createContext, useEffect } from "react";
import { makeGetAPICall } from "../utils/api";
import { reactLocalStorage } from "reactjs-localstorage";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [user, setUser] = useState({});
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [pinnedChats, setPinnedChats] = useState();
  const [otherChats, setOtherChats] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [otherUsers, setOtherUsers] = useState();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getUserData();
    fetchAllOtherUsers();
  }, []);

  // Fetch logged in user's profile
  const getUserData = async () => {
    setLoading(true);
    let localToken = reactLocalStorage.get("chatAppAuthToken");
    if (!localToken) {
      navigate("/");
      return;
    }
    setUser();
    setToken(localToken);
    const data = await makeGetAPICall("http:///localhost:8000/api/user", {
      Authorization: `Bearer ${localToken}`,
    });

    setUser(data.userData);
    setLoading(false);
    getUserChats();
    navigate("/chat");
  };

  // Fetch logged in user's chats - Pinned and Unpinned
  const getUserChats = async () => {
    // setLoading(true);
    let token = reactLocalStorage.get("chatAppAuthToken");
    if (!token) return;
    setPinnedChats();
    setOtherChats();
    const data = await makeGetAPICall("http:///localhost:8000/api/chat/", {
      Authorization: `Bearer ${token}`,
    });

    setPinnedChats(data.pinnedChats);
    setOtherChats(data.otherChats);
    // setLoading(false);
  };

  // Fetch profiles of all other users
  const fetchAllOtherUsers = async () => {
    let token = reactLocalStorage.get("chatAppAuthToken");
    if (!token) return;

    const data = await makeGetAPICall("http:///localhost:8000/api/user/all", {
      Authorization: `Bearer ${token}`,
    });
    setOtherUsers(data.users);
  };

  // Sign Out and reset states
  const signOut = () => {
    reactLocalStorage.remove("chatAppAuthToken");
    setUser();
    setToken();
    setPinnedChats();
    setOtherChats();
    setSelectedChat();
    navigate("/");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        token,
        getUserData,
        loading,
        getUserChats,
        pinnedChats,
        otherChats,
        signOut,
        selectedChat,
        setSelectedChat,
        otherUsers,
        onlineUsers,
        setOnlineUsers,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
