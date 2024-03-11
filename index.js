const express = require("express");
require("dotenv").config();
const app = express();

const myFrontend = process.env.FRONTEND;

const cors = require("cors");
const mongoose = require("mongoose");
const errorHandler = require("./errorHandler");

app.use(express.json());

app.use(cors());

const connectionToDataBase = process.env.DB_CREDENTIALS;
mongoose
  .connect(
    `mongodb+srv://${connectionToDataBase}@arinopolo.iq4vync.mongodb.net/tfm?retryWrites=true&w=majority`
  )
  .then(() => console.log("Conectado a la DB."));

const port = process.env.PORT;

const server = app.listen(port || `0.0.0.0:$PORT`, () => {
  console.log("Servidor funcionando.");
});

const io = require("socket.io")(server, {
  cors: {
    origin: myFrontend,
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  socket.on("new-user-add", (userId) => {
    console.log("user conectado", userId, activeUsers);
    if (!activeUsers.some((user) => user.userId === userId)) {
      activeUsers.push({
        userId: userId,
        socketId: socket.id,
      });
    }
    console.log("Connected users", activeUsers);
    io.emit("get-users", activeUsers);
  });

  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("sending from socket to ", receiverId);

    if (user) {
      io.to(user.socketId).emit("receive-message", data);

      console.log("receiving data", data);
    }
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User disconnected", activeUsers);
    io.emit("get-users", activeUsers);
  });
});

const sendMessage = (receiverId, message) => {
  const user = activeUsers.find((user) => user.userId === receiverId);
  if (user) {
    io.to(user.socketId).emit("receive-message", message);
  }
};
module.exports = { sendMessage };

const userRouter = require("./routes/userRouter");
const bicycleRouter = require("./routes/bicycleRouter");
const transactionRouter = require("./routes/transactionRouter");
const reviewRouter = require("./routes/reviewRouter");
const messageRouter = require("./routes/messageRouter");
const chatRouter = require("./routes/chatRouter");

app.use("/users", userRouter);
app.use("/bicycles", bicycleRouter);
app.use("/transactions", transactionRouter);
app.use("/reviews", reviewRouter);
app.use("/messages", messageRouter);
app.use("/chat", chatRouter);

app.use(errorHandler);
