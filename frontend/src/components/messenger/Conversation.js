import axios from "axios";
import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth/Auth";

const Conversation = ({ conversation }) => {
  const { user, token } = isAuthenticated().data;
  const [usr, setUsr] = useState(null);

  const friendId = conversation.members.find((m) => m !== user._id);

  useEffect(() => {
    let mounted = true;

    const getUser = () =>
      axios
        .get(`/user/${friendId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (mounted) {
            setUsr(res.data);
          }
        })
        .catch((err) => {
          // console.log(err);
        });
    getUser();
    return () => {
      mounted = false;
    };
  }, [user, conversation, friendId, token]);
  // console.log(usr);

  return (
    <div className="post" id="1">
      <div className="d-flex">
        <img
          src="https://res.cloudinary.com/dqm9cemhk/image/upload/v1627731688/iu_n2dwoq.jpg"
          alt="User Profile"
          style={{
            width: "3rem",
            height: "3rem",
            marginRight: "1rem",
            borderRadius: "50%",
          }}
        />
        <div>{usr && usr.firstName}</div>
      </div>
    </div>
  );
};

export default Conversation;
