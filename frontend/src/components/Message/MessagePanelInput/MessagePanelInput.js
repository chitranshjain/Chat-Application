import React from "react";
import "./MessagePanelInput.css";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import SendIcon from "@mui/icons-material/Send";

function MessagePanelInput({ newMessage, handleChange, sendMessage }) {
  return (
    <div className="message_panel">
      <Card>
        <Card.Header>Message Pannel</Card.Header>
        <Card.Body>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Control
                value={newMessage}
                onChange={handleChange}
                as="textarea"
                rows={2}
              />
            </Form.Group>
          </Form>

          <div className="messagepanel_footer">
            {/* <div className="footer_icons">
              <VideoCallIcon />
              <MicIcon />
              <SentimentSatisfiedAltIcon />
            </div> */}

            <div onClick={sendMessage} className="footer_icons submit_message">
              <SendIcon />
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default MessagePanelInput;
