const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./config/db");
const path = require("path");
const port = process.env.PORT || 5000;
const http = require("http");
const server = http.createServer(app);
const logger = require("./config/logger");
const swaggerUI = require("swagger-ui-express");
const yaml = require("yamljs");
const io = require("socket.io")(server, {
  cors: true,
  origins: ["http://127.0.0.1:5000"],
  methods: ["GET", "POST"],
  credentials: true,
});
const jwt = require("jsonwebtoken");
const User = require("./models/userSchema");
const Message = require("./models/messageSchema");

////*********/////

// --------------------------connect to the database------------------------------
connectDB();
// --------------------------middleware routing body parse------------------------------
app.use(express.json());

// --------------------------Winston res/req------------------------------
app.use(function (req, res, next) {
  logger.info(req.body);
  const prev = res.send;
  res.send = function (data) {
    // logger.info(JSON.parse(data));
    prev.apply(res, arguments);
  };

  next();
});
// --------------------------Routes------------------------------
app.use("/user", require("./routes/userRoutes"));
app.use("/blog", require("./routes/postRoutes"));
app.use("/todo", require("./routes/todoRoutes"));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "./controllers/uploads/"))
);
app.use("/conversations", require("./routes/conversationRoutes"));
app.use("/messages", require("./routes/messagesRoutes"));

// --------------------------Deployment------------------------------
app.use(express.static(path.join(__dirname, "../", "client", "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../", "client", "build", "index.html"));
});
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token;
    const verifyToken = await jwt.verify(token, process.env.SecretKey);
    if (!verifyToken) res.status(401).json({ msg: "you are not authorized" });
    socket.userID = verifyToken.id;
    next();
  } catch (error) {
    // res.status(500).json({ msg: error });
    console.log(error);
  }
});
io.on("connection", (socket) => {
  console.log("Connected: " + socket.userID);
  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.userID);
  });
  socket.on("joinRoom", ({ chatId }) => {
    socket.join(chatId);
    console.log("A user joined chatroom: " + chatId);
  });

  socket.on("leaveRoom", ({ chatId }) => {
    socket.leave(chatId);
    console.log("A user left chatroom: " + chatId);
  });
  socket.on("typing", (chatId) => {
    socket.in(chatId).emit("typing");
    console.log(chatId);
  });
  socket.on("stop typing", (chatId) => socket.in(chatId).emit("stop typing"));

  socket.on("chatroomMessage", async ({ chat, message }) => {
    if (message.trim().length > 0) {
      console.log(message);
      console.log(chat._id);
      const user = await User.findOne({ _id: socket.userID });
      const newMessage = new Message({
        chat: chat._id,
        sender: socket.userID,
        content: message,
        readBy: chat.users,
      });
      io.to(chat._id).emit("newMessage", {
        chatID: chat._id,
        content: message,
        name: user.fullname,
        avatar: user.avatar,
        userID: socket.userID,
      });
      await newMessage.save();
    }
  });
});
// REDIS //
// cache.connect();
// cache.on("connect", () => {
//   console.log("connected");
// });
// --------------------------Swagger io------------------------------
const swaggerDef = yaml.load("./swagger.yaml");
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDef));

server.listen(port, (error) => {
  error ? console.error(error) : console.log(`Server runing on port ${port}`);
  // logger.info(`Server runing on port ${port}`);
});
