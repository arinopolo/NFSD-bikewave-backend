const express = require("express");
const chatController = require("../controllers/chatController");
const router = express.Router();

//Routes

router.get("/", chatController.getChats);
router.get("/:id", chatController.getOneChat);
router.post("/", chatController.addChat);
router.delete("/:id", chatController.deleteChat);

module.exports = router;
