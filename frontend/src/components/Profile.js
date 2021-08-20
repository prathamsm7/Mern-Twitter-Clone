import React, { useState, useEffect } from "react";
import axios from "axios";
import { isAuthenticated } from "./auth/Auth";
import Navbar from "./Navbar";
import "./Profile.css";
import Post from "./Post";
import { Link } from "react-router-dom";

const Profile = ({ match, history }) => {
  const [profile, setProfile] = useState({});
  const [posts, setPosts] = useState([]);
  const [replies, setReplies] = useState([]);
  const [likes, setLikes] = useState([]);

  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  const { user } = isAuthenticated().data;
  const profileId = profile._id;

  const follow = () => {
    axios
      .put(`/follow/${user._id}/${profile._id}`)
      .then((res) => {})
      .catch((err) => {
        // console.log(err);
      });
  };

  useEffect(() => {
    let mounted = true;

    function getPosts() {
      axios
        .get("/posts", {
          params: { postedBy: profileId },
        })
        .then((res) => {
          if (mounted) {
            setPosts(res.data);
          }
        });
    }

    axios
      .get(`/profile/${match.params.email}`)
      .then((res) => {
        if (mounted) {
          setProfile(res.data);
          setReplies(res.data.replyTo);
          setLikes(res.data.likes.reverse());
        }
      })
      .catch((err) => {
        // console.log(err);
      });
    getPosts();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, profileId]);
  // console.log(likes);

  const messageClick = async () => {
    await axios
      .get(`/find/${profile._id}/${user._id}`)
      .then((res) => {
        // console.log(res);
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  return (
    <div className="container">
      <div className="row pt-2 pb-4">
        <Navbar />

        <div className="main-content-container col-10 col-md-8 col-lg-6">
          <div className="titleContainer">
            <h1>{profile.firstName}</h1>
          </div>
          {/*Profile Section*/}
          <div className="profileHeaderContainer">
            <div className="coverPhotoSection">
              <div className="coverPhotoContainer"></div>
              <div className="userImageContainer">
                <img
                  src="https://res.cloudinary.com/dqm9cemhk/image/upload/v1627731688/iu_n2dwoq.jpg"
                  alt="User Profile"
                />
              </div>
            </div>
            <div className="profileButtonsContainer"></div>
            <div className="userDetailsContainer">
              <span className="displayName">
                {profile.firstName} {profile.lastName}
              </span>
              <span className="username">@{profile.email}</span>

              {/*follow Section*/}
              <div className="textareaContainer mt-2">
                {user._id !== profile._id ? (
                  profile.followers && !profile.followers.includes(user._id) ? (
                    <button onClick={() => follow()} id="submitPostButton">
                      follow
                    </button>
                  ) : (
                    <>
                      {/* TODO:Unfollow Button*/}
                      <button
                        className="m-2 p-2"
                        id="submitPostButton"
                        onClick={() => {
                          follow();
                        }}
                      >
                        unfollow
                      </button>
                      {/* TODO:Message Button*/}

                      <button
                        style={{
                          backgroundColor: "var(--blue)",
                          color: "white",
                          border: "none",
                          borderRadius: "40px",
                          padding: "7px 15px",
                        }}
                        onClick={() => {
                          messageClick();
                          history.push("/messages");
                        }}
                        id="messageButton"
                        className="ml-2"
                      >
                        Message
                      </button>
                    </>
                  )
                ) : null}
              </div>
              <div className="followersContainer">
                <a href="/profile/<%=payload.user.username%>/following">
                  <span style={{ marginRight: "1rem" }}>
                    {" "}
                    <small
                      style={{
                        fontWeight: "bold",
                        color: "black",
                        fontSize: "1rem",
                      }}
                    >
                      {profile.followers ? (
                        <small style={{ fontWeight: "bold" }}>
                          {profile.following.length}
                        </small>
                      ) : (
                        0
                      )}
                    </small>{" "}
                    Following
                  </span>
                </a>

                <a href="/profile/<%=payload.user.username%>/followers">
                  <span>
                    <small
                      style={{
                        fontWeight: "bold",
                        color: "black",
                        fontSize: "1rem",
                      }}
                    >
                      {profile.followers ? (
                        <small style={{ fontWeight: "bold" }}>
                          {profile.followers.length}
                        </small>
                      ) : (
                        0
                      )}
                    </small>{" "}
                    Followers
                  </span>
                </a>
              </div>
            </div>
            {/*Profile Tabs*/}
          </div>
          <div className="tabsContainer">
            <div className="bloc-tabs">
              <button
                className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
                onClick={() => toggleTab(1)}
              >
                Tweets
              </button>
              <button
                className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
                onClick={() => toggleTab(2)}
              >
                Replies
              </button>
              <button
                className={toggleState === 3 ? "tabs active-tabs" : "tabs"}
                onClick={() => toggleTab(3)}
              >
                Likes
              </button>
            </div>

            {/*User post section*/}
            <div className="userPostsContainer">
              <div className="content-tabs">
                <div
                  className={
                    toggleState === 1 ? "content  active-content" : "content"
                  }
                >
                  <span className="noResults">
                    {posts ? (
                      posts.map((post, index) => {
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
                      })
                    ) : (
                      <h5>Posts not found</h5>
                    )}
                  </span>
                </div>

                {/*User replies section*/}
                <div
                  className={
                    toggleState === 2 ? "content  active-content" : "content"
                  }
                >
                  {replies ? (
                    replies.map((post, index) => {
                      return (
                        <Post
                          key={index}
                          reply={
                            <div style={{ color: "navy" }}>
                              Replying to{" "}
                              <Link to={`/profile/${post.postedBy.email}`}>
                                {post.postedBy.email.substring(0, 7)}...
                              </Link>
                            </div>
                          }
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
                    })
                  ) : (
                    <span>not found</span>
                  )}
                </div>

                {/*User Likes Section*/}

                <div
                  className={
                    toggleState === 3 ? "content  active-content" : "content"
                  }
                >
                  <span className="noResults">
                    {likes ? (
                      likes.map((post, index) => {
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
                      })
                    ) : (
                      <h5>Posts not found</h5>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-none d-md-block col-md-2 col-lg-4"></div>
      </div>
    </div>
  );
};

export default Profile;
