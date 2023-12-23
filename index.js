const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const mongoose = require("mongoose");

app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log("Servidor funcionando");
});
