const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const mongoose = require("mongoose");


app.use(express.json());

app.use(cors());

const userRouter = require("./routes/userRouter");

mongoose.connect(
  "mongodb+srv://arinopolo:Hostalcaixa4719@arinopolo.iq4vync.mongodb.net/tfm?retryWrites=true&w=majority"
);

app.use("/users", userRouter);

app.listen(port, () => {
  console.log("Servidor funcionando");
});
