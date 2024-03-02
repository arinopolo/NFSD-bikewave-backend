const Chat = require("../models/chatModel");

const chatController = {
  //obtener la informacion de todas los chat de un usuario
  getChats: async (req, res, next) => {
    try {
      const chatList = await Chat.find({
        members: { $in: [req.userId] },
      });
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
      return res.status(400).json({ message: "El chat ya existe" });
    }

    const newChat = new Chat({
      members: [userId, receiverId],
    });
    try {
      const result = await newChat.save();
      res.status(200).json(result);
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
};

module.exports = chatController;
