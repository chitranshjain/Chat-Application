import React from "react";
import { Link } from "react-router-dom";
import chat from "../../Assets/chat.svg";
import { Row, Col } from "react-bootstrap";
import "./LandingPage.css";

function LandingPage() {
  return (
    <Row>
      <Col lg={9}>
        <section
          className="text-gray-600 body-font"
          style={{ /* backgroundColor: "#ffb20a", */ height: "100vh" }}
        >
          <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
            <img
              className="lg:w-3/6 md:w-3/6 w-5/6 mb-10 object-cover object-center rounded"
              alt="hero"
              src={chat}
            />
            <div className="text-center lg:w-2/3 w-full">
              <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
                Welcome to our Chat Application
              </h1>
              <div className="flex justify-center">
                <button className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                  <Link
                    to="/signin"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    Sign In
                  </Link>
                </button>
                <button className="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">
                  <Link
                    to="/signup"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    Sign Up
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </section>
      </Col>
      <Col className="landing-bg-col" lg={3}></Col>
    </Row>
  );
}

export default LandingPage;
