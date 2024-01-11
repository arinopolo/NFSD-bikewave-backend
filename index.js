const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const mongoose = require("mongoose");
const errorHandler = require("./errorHandler");

app.use(express.json());

app.use(cors());

const userRouter = require("./routes/userRouter");
const bicycleRouter = require("./routes/bicycleRouter");
const transactionRouter = require("./routes/transactionRouter");
const reviewRouter = require("./routes/reviewRouter");

mongoose.connect(
  "mongodb+srv://arinopolo:Hostalcaixa4719@arinopolo.iq4vync.mongodb.net/tfm?retryWrites=true&w=majority"
);

app.use("/users", userRouter);
app.use("/bicycles", bicycleRouter);
app.use("/transactions", transactionRouter);
app.use("/reviews", reviewRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log("Servidor funcionando");
});
