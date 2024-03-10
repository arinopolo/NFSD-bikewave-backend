const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const messageController = require("../controllers/messageController");
const { default: mongoose, mongo } = require("mongoose");

const chatController = {
  //obtener la informacion de todas los chat de un usuario
  getChats: async (req, res, next) => {
    try {
      const chatList = await Chat.find({
        members: { $in: [req.userId] },
      }).lean();

      //-----

      for (let i = 0; i < chatList.length; i++) {
        const messageList = await Message.find({ chatId: chatList[i]._id });

        let unreadMessagesCount = 0;

        unreadMessagesCount = messageList.filter(
          (message) => !message.seen && message.author.toString() !== req.userId
        ).length;

        chatList[i].unreadMessagesCount = unreadMessagesCount;
        /* console.log(
          `"mensajes no leidos de este chat ${chatList[i]._id}`,
          chatList[i].unreadMessagesCount
        ); */
      }

      //-----

      res.status(200).json(chatList);
    } catch (error) {
      next(error);
    }
  },

  //obtener la informacion de una bicicleta
  getOneChat: async (req, res, next) => {
    try {
      const chat = await Chat.findOne({
        members: { $all: [req.userId, req.params.secondId] },
      });

      res.status(200).json(chat);
    } catch (error) {
      next(error);
    }
  },
  // agregar chat
  addChat: async (req, res, next) => {
    const userId = req.userId;
    const receiverId = req.body.receiverId;

    const existingChat = await Chat.findOne({
      members: {
        $all: [userId, receiverId],
      },
    });

    // si ya existe un chat enviamos un mensaje de error
    if (existingChat) {
      return res
        .status(400)
        .json({ message: "El chat ya existe", chat: existingChat });
    }

    const newChat = new Chat({
      members: [userId, receiverId],
    });
    try {
      const result = await newChat.save();
      console.log(result);
      res.status(200).json({ result, success: true });
    } catch (error) {
      next(error);
    }
  },
  //eliminar un chat
  deleteChat: async (req, res, next) => {
    try {
      const chatToBeDeleted = req.params.id;
      const indexToBeDeleted = await Chat.findById(chatToBeDeleted);

      if (indexToBeDeleted) {
        await Chat.deleteOne({ _id: indexToBeDeleted });
        res
          .status(200)
          .json({ msg: `Chat deleted. The id is: ${chatToBeDeleted}` });
      } else {
        res
          .status(404)
          .json({ msg: `Chat with id ${chatToBeDeleted} is not found.` });
      }
    } catch (error) {
      next(error);
    }
  },

  seenMessage: async (req, res, next) => {
    try {
      const chatId = req.params.id;
      console.log(req.userId);
      console.log(chatId);

      const messagesToBeUpdated = await Message.updateMany(
        {
          chatId: new mongo.ObjectId(chatId),
          seen: false,
          author: { $ne: new mongo.ObjectId(req.userId) },
        },
        { $set: { seen: true } }
      );

      console.log(messagesToBeUpdated);
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  },
};

module.exports = chatController;
