const io = require("socket.io")(8800, {
  cors: {
    origin: "http://localhost:5173",
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
