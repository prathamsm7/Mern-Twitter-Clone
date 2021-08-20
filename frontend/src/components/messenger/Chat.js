import React from "react";
import "./Chat.css";
import { format } from "timeago.js";

const Chat = ({ message, own }) => {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src="https://res.cloudinary.com/dqm9cemhk/image/upload/v1627731688/iu_n2dwoq.jpg"
          alt=""
        />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
};

export default Chat;
