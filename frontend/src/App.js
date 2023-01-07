import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import Signin from "./pages/Signin/Signin.js";
import Signup from "./pages/Signup/Signup.js";
import ChatPage from "./pages/ChatPage/ChatPage.js";
import { UserProvider } from "./Context/UserContext.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  // ADDED TODOS :MessageChatArea.js

  return (
    <>
      <ToastContainer />
      <Router>
        <UserProvider>
          <div className="App">
            <Routes>
              <Route path="/" exact element={<LandingPage />} />
              <Route path="/signin" exact element={<Signin />} />
              <Route path="/signup" exact element={<Signup />} />
              <Route path="/chat" element={<ChatPage />} />
            </Routes>
          </div>
        </UserProvider>
      </Router>
    </>
  );
}

export default App;
