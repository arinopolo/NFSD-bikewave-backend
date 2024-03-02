const express = require("express");
const chatController = require("../controllers/chatController");
const userController = require("../controllers/userController");

const router = express.Router();

//Routes

router.get("/", userController.verifyToken, chatController.getChats);
router.get(
  "/find/:secondId",
  userController.verifyToken,
  chatController.getOneChat
);
router.post("/", userController.verifyToken, chatController.addChat);
router.delete("/:id", userController.verifyToken, chatController.deleteChat);

module.exports = router;
