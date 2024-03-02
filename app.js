const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const errorHandler = require("./errorHandler");


app.use(express.json());

app.use(cors());

const userRouter = require("./routes/userRouter");
const bicycleRouter = require("./routes/bicycleRouter");
const transactionRouter = require("./routes/transactionRouter");
const reviewRouter = require("./routes/reviewRouter");
const messageRouter = require("./routes/messageRouter");
const chatRouter = require("./routes/chatRouter");

const connectionToDataBase = process.env.DB_CREDENTIALS;
mongoose
  .connect(
    `mongodb+srv://${connectionToDataBase}@arinopolo.iq4vync.mongodb.net/tfm?retryWrites=true&w=majority`
  )
  .then(() => console.log("Conectado a la DB."));

app.use("/users", userRouter);
app.use("/bicycles", bicycleRouter);
app.use("/transactions", transactionRouter);
app.use("/reviews", reviewRouter);
app.use("/messages", messageRouter);
app.use("/chat", chatRouter);

app.use(errorHandler);


module.exports = app;
