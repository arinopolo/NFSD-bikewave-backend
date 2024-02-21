const Chat = require("../models/chatModel");

const chatController = {
  //obtener la informacion de todas los chat de un usuario
  getChats: async (req, res, next) => {
    try {
      const userId = req.params.id;
      const chatList = await Chat.find({
        $or: [{ participantOne: userId }, { participantTwo: userId }],
      });
      res.json(chatList);
    } catch (error) {
      next(error);
    }
  },
  //obtener la informacion de una bicicleta
  getOneChat: async (req, res, next) => {
    try {
      const chatToBeConsulted = req.params.id;
      const indexOfChatToBeConsulted = await Chat.findById(chatToBeConsulted);

      // cuando pongo un id aleatorio para que me ejecute el else no me lo ejecuto, me de el error de BSON...
      if (indexOfChatToBeConsulted) {
        res.json(await Chat.find(indexOfChatToBeConsulted));
      } else {
        res.status(404).json({
          msg: `Chat with id ${chatToBeConsulted} is not found.`,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  // agregar chat
  addChat: async (req, res, next) => {
    try {
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
