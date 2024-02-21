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
      return res.status(200).json({
        msg: `User logged in.`,
        token,
        success: true,
        userId: foundUser._id,
        userName: foundUser.firstName,
      });
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

  getMyBicycles: async (req, res, next) => {
    try {
      const user = await User.findById(req.userId).populate("bicycles");
      res.status(200).json(user.bicycles);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  getFavorites: async (req, res, next) => {
    try {
      const user = await User.findById(req.userId).populate("favorites");
      res.status(200).json(user.favorites);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  addAndDeleteFavorites: async (req, res, next) => {
    try {
      const bicycleId = req.params.id;
      const user = await User.findById(req.userId);

      const favorites = user.favorites;
      const index = favorites.indexOf(bicycleId);
      if (index !== -1) {
        favorites.splice(index, 1);
        await user.save();

        await Bicycle.findByIdAndUpdate(bicycleId, { isFav: false });

        res.status(200).json({
          message: "Bicycle removed from the favorites list.",
          isFav: false,
        });
      } else {
        // Agregar la bicicleta a la lista de favoritos del usuario
        user.favorites.push(bicycleId);
        await user.save();

        await Bicycle.findByIdAndUpdate(bicycleId, { isFav: true });

        res.status(200).json({
          message: "Bicycle added to the favorites list.",
          isFav: true,
        });
      }
    } catch (error) {
      next(error);
    }
  },

  deleteFromFavorites: async (req, res, next) => {
    try {
      const bicycleId = req.params.id;
      const user = await User.findById(req.userId);

      if (user.favorites.includes(bicycleId)) {
        const index = user.favorites.findIndex(
          (item) => item._id === bicycleId
        );
        user.favorites.splice(index, 1);
        await user.save();

        res.status(200).json({
          message: "Bicycle deleted from the favorites list.",
        });
      } else {
        return res.status(400).json({
          message: "Bicycle is not in the favorites list.",
        });
      }
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
