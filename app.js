require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
const socket = require("socket.io");

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const conversationRoutes = require("./routes/conversation");
const messageRoutes = require("./routes/message");

const connectDB = async () => {
  const conn = await mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB Connected");
    })
    .catch((err) => {
      console.log(err);
      console.log("something wrong with DB");
    });
};

// use as a function
connectDB();

const sessionConfig = {
  secret: "ThisIsMySecret",
  resave: false,
  saveUninitialized: true,
};

app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));
app.use(express.json());
app.use(cors());

app.use(authRoutes);
app.use(postRoutes);
app.use(conversationRoutes);
app.use(messageRoutes);

if (process.env.NODE_ENV == "production") {
  app.use(express.static("frontend/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// TODO: server config
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

//storing users
let users = [];

//adding users
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

//removing users
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  // console.log("User Connected");

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user).emit("getMessage", { senderId, text });
  });

  //when discconect
  socket.on("disconnect", () => {
    // console.log("User Disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
