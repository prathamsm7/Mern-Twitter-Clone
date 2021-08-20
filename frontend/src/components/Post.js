import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Post.css";
import { isAuthenticated } from "./auth/Auth";
import axios from "axios";
import { timeDifference } from "../backend";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

const Post = ({
  displayname,
  username,
  content,
  image,
  like,
  post,
  comment,
  reply,
}) => {
  const timestamp = timeDifference(new Date(), new Date(post.createdAt));
  const { user, token } = isAuthenticated().data;
  const userId = user._id;

  const [likes, setLikes] = useState([{}]);
  const [text, setText] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(
        `/post/${post._id}/comments/${user._id}`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setText("");
        setShow(false);
      })
      .catch((err) => {
        setText("");
        setShow(false);
        toast.warning("Unable to reply");
      });
  };

  const likePost = (id) => {
    axios
      .patch(
        `/post/${id}/like/${userId}`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setLikes(res.data);
      })
      .catch((err) => {
        // console.log(err);
        toast.error("something went wrong");
      });
  };

  return (
    <>
      <div className="post">
        <div className="mainContentContainer">
          <div className="postUserImageContainer">
            <img
              src="https://res.cloudinary.com/dqm9cemhk/image/upload/v1627731688/iu_n2dwoq.jpg"
              alt="User Profile"
            />
          </div>
          <div className="postContentContainer">
            <div className="header">
              <Link
                to={`/profile/${post.postedBy.email}`}
                className="displayName"
              >
                {displayname}
              </Link>
              <small className="username">@{username.substring(0, 7)}...</small>
              <small className="date">{timestamp}</small>
              {/* <div>${replyFlag}</div> */}
            </div>
            <div className="postBody">
              {reply}
              <span>{content}...</span>
              <img src={image} alt="" />
            </div>
            <div className="postFooter mt-2">
              {/*comment section*/}
              <div className="postButtonContainer">
                <div className="btn btn-outline-success" onClick={handleShow}>
                  <i className="far fa-comment"></i>
                  <span> {comment}</span>
                </div>
                {/*comment modal*/}
                <Modal show={show} onHide={handleClose}>
                  <Modal.Header>
                    <Modal.Title>Reply to Tweet</Modal.Title>
                    <span onClick={handleClose}>
                      <i className="far fa-times-circle"></i>
                    </span>
                  </Modal.Header>

                  <Modal.Body>
                    <div className="header mb-2">
                      <Link to="" className="displayName">
                        {displayname}
                      </Link>
                      <small className="username">
                        @{username.substring(0, 7)}...
                      </small>
                      <small className="date">{timestamp}</small>
                    </div>
                    <div className="postBody">
                      <span>{content}...</span>
                    </div>
                    <small className="replyTo"> Replying to @{username}</small>{" "}
                    <Form.Group>
                      <input
                        type="text"
                        onChange={(e) => setText(e.target.value)}
                        value={text}
                        placeholder="Tweet your reply"
                      />
                    </Form.Group>
                  </Modal.Body>

                  <Modal.Footer>
                    <Button variant="primary" onClick={handleSubmit}>
                      Reply
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>

              <div className="postButtonContainer ">
                <div className="retweet btn btn-outline-info">
                  <i className="fas fa-retweet"></i>
                </div>
              </div>

              <div className="postButtonContainer ">
                <div
                  className="likeButton btn btn-outline-danger"
                  onClick={() => likePost(post._id)}
                >
                  <i className="fas fa-heart"></i> <span> {like}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
