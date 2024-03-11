const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const { sendMessage } = require("../app");

console.log("qie es sendMessage", sendMessage);

const messageController = {
  //obtener la informacion de todos los mensajes
  getMessages: async (req, res, next) => {
    const { chatId } = req.params;
    const userId = req.userId;
    try {
      const messageList = await Message.find({ chatId });

      const unreadMessagesCount = messageList.filter(
        (message) => !message.seen && message.author.toString() !== userId
      ).length;

      res.status(200).json(messageList);
    } catch (error) {
      next(error);
    }
  },

  // agregar un mensaje nuevo
  addMessage: async (req, res, next) => {
    const author = req.userId;
    const { chatId, text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ msg: "Text field cannot be empty" });
    }
    try {
      const existingChat = await Chat.findById(chatId);
      if (!existingChat) {
        return res.status(404).json({ msg: "Chat doesnt exist" });
      }

      const message = new Message({
        chatId,
        author,
        text,
      });
      const result = await message.save();

      const receiverId = existingChat.members.find(
        (id) => id.toString() !== author
      );
      console.log("receiver id ", receiverId, author);
      sendMessage(receiverId.toString(), result);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = messageController;
