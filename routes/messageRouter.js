const express = require("express");
const messageController = require("../controllers/messageController");
const router = express.Router();
const userController = require("../controllers/userController");

//Routes

router.get(
  "/:chatId",
  userController.verifyToken,
  messageController.getMessages
);

router.post("/", userController.verifyToken, messageController.addMessage);


module.exports = router;
