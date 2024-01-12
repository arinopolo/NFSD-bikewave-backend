const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mySecret = "cooper";

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
        res.status(200).json(await User.find(indexOfUserToBeConsulted));
      } else {
        res
          .status(404)
          .json({ msg: `User with id ${userToBeConsulted} is not found.` });
      }
    } catch (error) {
      next(error);
    }
  },
  addUser: async (req, res, next) => {
    try {
      //encriptar la contraseña

      let userSalt = Math.random().toFixed(7);
      userSalt = Number(userSalt);
      const encryptedPassword = await bcrypt.hash(req.body.password, userSalt);

      const userToAdd = new User({
        ...req.body,
        password: encryptedPassword,
        salt: userSalt,
      });
      await userToAdd.save();
      console.log(userToAdd);
      res
        .status(200)
        .json({ msg: `User registered. The id is: ${userToAdd._id}` });
    } catch (error) {
      next(error);
    }
  },

  checkUser: async (req, res, next) => {
    const { email, password } = req.body;

    // comprobando si el email esta registrado
    const [foundUser] = await User.find({ email });
    if (!foundUser) {
      return res
        .status(404)
        .json({ msg: `User with email ${req.body.email} is not found.` });
    }

    // comprobando si la contraseña es correcta
    if (await bcrypt.compare(password, foundUser.password)) {
      // el usuario ha entrado en la app y esta activo
      foundUser.isActive = true;
      await foundUser.save();
      console.log(foundUser);
      //genero un token o jwt
      const token = jwt.sign({ email: foundUser.email }, mySecret, {
        expiresIn: "1d",
      });
      return res.status(200).json({ msg: `User logged in.`, token });
    }

    res.status(404).json({ msg: `Incorrert password.` });
  },

  verifyToken: async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        res.status(404).json({ msg: `Missing token.` });
      }
      if (jwt.verify(token, mySecret)) {
        return next();
      } 
    } catch (error) {
      next(error);
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const { email } = req.body;
      const foundUser = await User.findOne({ email });

      if (!foundUser || !foundUser.isActive) {
        return res.status(404).json({ msg: "User not authorized." });
      }

      // genera un nuevo token si el usuario esta activo
      const token = jwt.sign({ email: foundUser.email }, mySecret, {
        expiresIn: "1d",
      });

      res.status(200).json({ msg: "Token refreshed.", token });
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
        res
          .status(200)
          .json({ msg: `User deleted. The id is:  ${userToBeDeleted}` });
      } else {
        res
          .status(404)
          .json({ msg: `User with id ${userToBeDeleted} is not found.` });
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
        res
          .status(200)
          .json({ msg: `User changed. The id is: ${userToBeChanged}` });
      } else {
        res
          .status(404)
          .json({ msg: `User with id ${idToBeChanged} is not found.` });
      }
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
