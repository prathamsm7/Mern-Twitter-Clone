import React from "react";
import "./widgets.css";
import { TwitterTweetEmbed } from "react-twitter-embed";

const Widgets = () => {
  return (
    <div className="d-none d-md-block col-md-2 col-lg-4">
      <div className="widgets__widgetContainer">
        <h2>Whats'happening</h2>
        <TwitterTweetEmbed
          tweetId={"841418541026877441"}
          optins={{ width: "100px", maxWidth: "80px" }}
        />
      </div>
    </div>
  );
};

export default Widgets;
