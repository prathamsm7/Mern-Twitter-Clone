import React, { useState } from "react";
import axios from "axios";
import { isAuthenticated } from "./auth/Auth";
import "./Tweetbox.css";

const TweetBox = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const { user, token } = isAuthenticated().data;

  const handelSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", content);
    formData.append("image", image);
    axios
      .post(`/newpost/${user._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log(res);
        setContent("");
        setImage("");
      })
      .catch((err) => {
        setContent("");
        setImage("");
        // console.log(err);
      });
  };

  return (
    <div className="postContainer mt-2">
      <div className="userImageContainer">
        <img
          src="https://res.cloudinary.com/dqm9cemhk/image/upload/v1627731688/iu_n2dwoq.jpg"
          alt="User Profile"
        />
      </div>

      <form
        className="needs-validation textareaContainer mt-2"
        noValidate
        onSubmit={handelSubmit}
      >
        <textarea
          onChange={(e) => setContent(e.target.value)}
          className="form-control"
          value={content}
          cols="30"
          rows="3"
          placeholder="What's happening?"
          required
        ></textarea>

        <input
          type="file"
          placeholder="Optional: Post Image"
          name="image"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button id="submitPostButton" type="submit">
          Post
        </button>
      </form>
    </div>
  );
};

export default TweetBox;
