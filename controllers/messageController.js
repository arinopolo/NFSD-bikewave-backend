const Message = require("../models/messageModel");

const messageController = {
  //obtener la informacion de todos los mensajes
  getMessages: async (req, res, next) => {
    try {
      const messageList = await Message.find();
      res.json(messageList);
    } catch (error) {
      next(error);
    }
  },
  //obtener la informacion de un mensaje solo
  getOneMessage: async (req, res, next) => {
    try {
      const messageToBeConsulted = req.params.id;
      const indexOfMessageToBeConsulted = await Message.findById(
        messageToBeConsulted
      );

      if (indexOfMessageToBeConsulted) {
        res.json(await Message.find(indexOfMessageToBeConsulted));
      } else {
        res.status(404).json({
          msg: `Messsage with id ${messageToBeConsulted} is not found.`,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  // agregar un mensaje nuevo
  addMessage: async (req, res, next) => {
    try {
      const messageToAdd = new Message(req.body);

      await messageToAdd.save();

      res
        .status(200)
        .json({ msg: `Message added. The id is: ${messageToAdd._id}` });
    } catch (error) {
      next(error);
    }
  },
  //eliminar un mensaje
  deleteMessage: async (req, res, next) => {
    try {
      const messageToBeDeleted = req.params.id;
      const indexToBeDeleted = await Message.findById(messageToBeDeleted);

      if (indexToBeDeleted) {
        await Message.deleteOne({ _id: indexToBeDeleted });
        res
          .status(200)
          .json({ json: `Message deleted. The id is: ${messageToBeDeleted}` });
      } else {
        res
          .status(404)
          .json({ msg: `Message with id ${messageToBeDeleted} is not found.` });
      }
    } catch (error) {
      next(error);
    }
  },
};

module.exports = messageController;
