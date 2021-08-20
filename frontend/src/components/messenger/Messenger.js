import React, { useState, useEffect, useRef } from "react";
import Conversation from "./Conversation";
import Navbar from "../Navbar";
import Chat from "./Chat";
import "./Messenger.css";
import { isAuthenticated } from "../auth/Auth";
import axios from "axios";
import { io } from "socket.io-client";

const Messenger = () => {
  const { user } = isAuthenticated().data;

  const [conversation, setConversation] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = useRef();
  const scrollRef = useRef();

  useEffect(() => {
    let mounted = true;
    socket.current = io("ws://localhost:5000");
    socket.current.on("getMessage", (data) => {
      if (mounted) {
        setArrivalMessage({
          sender: data.senderId,
          text: data.text,
          createdAt: Date.now(),
        });
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
      // console.log(users);
    });
  }, [user]);

  useEffect(() => {
    let mounted = true;

    const getConversation = () => {
      axios
        .get(`conversation/${user._id}`)
        .then((res) => {
          if (mounted) {
            setConversation(res.data);
          }
        })
        .catch((err) => {
          // console.log(err);
        });
    };
    getConversation();
    return () => {
      mounted = false;
    };
  }, [user._id]);

  // console.log(conversation);

  useEffect(() => {
    let mounted = true;

    const getMessage = () => {
      axios
        .get(`/message/${currentChat}`)
        .then((res) => {
          if (mounted) {
            setMessages(res.data);
          }
        })
        .catch((err) => {});
    };
    getMessage();
    return () => {
      mounted = false;
    };
  }, [currentChat, messages]);

  // console.log(currentChat);

  const handleSubmit = (e) => {
    e.preventDefault();
    const receiverId = currentChat;
    // console.log(receiverId);
    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    axios
      .post("/message", {
        conversationId: currentChat,
        sender: user._id,
        text: newMessage,
      })

      .then((res) => {
        setMessages([...messages, res.data]);
        setNewMessage("");
      })
      .catch((err) => {});
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // console.log(currentChat);
  return (
    <div className="container">
      <div className="row pt-2 pb-4">
        <Navbar />
        {/*//TODO:  Message Component*/}
        <div className="main-content-container col-10 col-md-4 col-lg-4">
          <div className="titleContainer">
            <h1 className="fw-bold ">Messages</h1>
          </div>
          {conversation.map((c, index) => {
            return (
              <div onClick={() => setCurrentChat(c._id)} key={index}>
                <Conversation conversation={c} />
              </div>
            );
          })}
        </div>
        {/*//TODO:  Chat Component*/}

        <div
          className="d-none d-md-block col-md-6 col-md-2 col-lg-6 chatBox"
          id="chatbox"
        >
          <div className="titleContainer">
            <h1 className="fw-blod">Inbox</h1>
          </div>
          <div className="chatBoxWrapper">
            <div className="chatBoxTop">
              {currentChat ? (
                <>
                  {messages &&
                    messages.map((m, index) => (
                      <div ref={scrollRef} key={index}>
                        <Chat message={m} own={m.sender === user._id} />
                      </div>
                    ))}
                  <div className="chatBoxBottom">
                    <textarea
                      className="chatMessageInput "
                      placeholder="write something..."
                      cols={40}
                      onChange={(e) => setNewMessage(e.target.value)}
                      value={newMessage}
                      required
                    ></textarea>
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      className="chatSubmitButton"
                    >
                      Send
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="fw-bold inbox">
                    You dont have a message selected Choose one from your
                    existing messages, or start a new one.
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messenger;
