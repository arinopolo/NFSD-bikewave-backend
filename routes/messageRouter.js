const express = require("express");
const messageController = require("../controllers/messageController");
const router = express.Router();

//Routes

router.get("/", messageController.getMessages);
router.get("/:id", messageController.getOneMessage);
router.post("/", messageController.addMessage);
router.delete("/:id", messageController.deleteMessage);

module.exports = router;
