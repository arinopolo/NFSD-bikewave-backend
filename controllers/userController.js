const User = require("../models/userModel");

const userController = {
  //obtener la informacion de todos los usuarios
  getUsers: async (req, res, next) => {
    try {
      const userList = await User.find();
      res.json(userList);
    } catch (error) {
      next(error);
    }
  },
  getOneUser: async (req, res, next) => {
    try {
      const userToBeConsulted = req.params.id;
      const indexOfUserToBeConsulted = await User.findById(userToBeConsulted);

      // cuando pongo un id aleatorio para que me ejecute el else no me lo ejecuto, me de el error de BSON...
      if (indexOfUserToBeConsulted) {
        res.json(await User.find(indexOfUserToBeConsulted));
      } else {
        res.status(404).send(`User with id ${userToBeConsulted} is not found.`);
      }
    } catch (error) {
      next(error);
    }
  },

  addUser: async (req, res, next) => {
    try {
      const userToAdd = new User(req.body);
      await userToAdd.save();

      res.send(`User registered. The id is: ${userToAdd._id}`);
    } catch (error) {
      next(error);
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      const userToBeDeleted = req.params.id;
      const indexToBeDeleted = await User.findById(userToBeDeleted);

      if (indexToBeDeleted) {
        await User.deleteOne({ _id: indexToBeDeleted });
        res.send(`User deleted. The id is:  ${userToBeDeleted}`);
      } else {
        res.status(404).send(`User with id ${userToBeDeleted} is not found.`);
      }
    } catch (error) {
      next(error);
    }
  },
  changeUser: async (req, res, next) => {
    try {
      const idToBeChanged = req.params.id;

      const newData = req.body;

      let userToBeChanged = await User.findByIdAndUpdate(
        idToBeChanged,
        newData,
        { new: true }
      );

      if (userToBeChanged) {
        res.send(`User changed. The id is: ${userToBeChanged}`);
      } else {
        res.status(404).send(`User with id ${idToBeChanged} is not found.`);
      }
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
