const User = require("../models/userModel");
const Bicycle = require("../models/bicycleModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const mySecret = process.env.SECRET;

const userController = {
  //obtener la informacion de todos los usuarios

  getOneUser: async (req, res, next) => {
    try {
      const indexOfUserToBeConsulted = await User.findById(req.userId);
      // cuando pongo un id aleatorio para que me ejecute el else no me lo ejecuto, me de el error de BSON...
      if (indexOfUserToBeConsulted) {
        res.status(200).json(indexOfUserToBeConsulted);
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

      res.status(200).json({
        msg: `User registered. The id is: ${userToAdd._id}`,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  },

  loginUser: async (req, res, next) => {
    const { email, password } = req.body;

    // chequeando si el email esta registrado
    const [foundUser] = await User.find({ email });
    if (!foundUser) {
      return res.status(301).json({ msg: `Incorrect login.` });
    }

    // comprobando si la contraseña es correcta
    if (await bcrypt.compare(password, foundUser.password)) {
      //genero un token o jwt
      const token = jwt.sign(
        { email: foundUser.email, id: foundUser._id },
        mySecret,

        {
          expiresIn: "30d",
        }
      );
      return res
        .status(200)
        .json({ msg: `User logged in.`, token, success: true });
    }

    res.status(403).json({ msg: `Incorrect credentials.`, success: false });
  },

  verifyToken: async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        res.status(403).json({ msg: `Missing token.`, success: false });
      }
      jwt.verify(token, mySecret, (error, decoded) => {
        if (error) {
          return res
            .status(403)
            .json({ msg: ` Invalid token.`, success: false });
        }

        req.userId = decoded.id;

        return next();
      });
    } catch (error) {
      next(error);
    }
  },
  getFavorites: async (req, res, next) => {
    try {
      const user = await User.findById(req.userId).populate("favorites");
      res.json(user.favorites);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

   addToFavorites: async (req, res, next) => {
    try {
      const bicycleId = req.params.id;
      const user = await User.findById(req.userId);

      if (user.favorites.includes(bicycleId)) {
        return res.status(400).json({
          message: "La bicicleta ya está en la lista de favoritos del usuario",
        });
      }

      // Agregar la bicicleta a la lista de favoritos del usuario
      user.favorites.push(bicycleId);
      await user.save();

      res.status(200).json({
        message: "Bicicleta agregada a la lista de favoritos del usuario",
      });
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
