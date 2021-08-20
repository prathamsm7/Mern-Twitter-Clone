import React, { useEffect, useState } from "react";
import "./Feed.css";
import Tweetbox from "./Tweetbox";
import Post from "./Post";
import axios from "axios";
import { toast } from "react-toastify";

const Feed = () => {
  const [post, setPost] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchPosts = async (req, res) => {
      await axios
        .get(`/posts`)
        .then((res) => {
          if (mounted) {
            setPost(res.data);
          }
        })
        .catch((err) => {
          // console.log(err);
          toast.error("something went wrong");
        });
    };
    fetchPosts();
    return () => {
      mounted = false;
    };
  }, [post]);

  return (
    <>
      <div className="main-content-container col-10 col-md-8 col-lg-6">
        <div className="titleContainer">
          <h1 className="fw-bold ">Home</h1>
        </div>

        <Tweetbox />

        {post.map((post, index) => {
          return (
            <Post
              key={index}
              post={post}
              displayname={`${post.postedBy.firstName} ${post.postedBy.lastName}`}
              username={post.postedBy.email}
              content={post.content}
              image={post.image}
              like={post.likes.length}
              comment={post.comments.length}
              createdAt={post.createdAt}
              // likePost={likePost()}
            />
          );
        })}
      </div>
    </>
  );
};

export default Feed;
