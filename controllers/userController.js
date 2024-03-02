const User = require("../models/userModel");
const Bicycle = require("../models/bicycleModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

/*const Resend = require("resend").Resend;
const resend = new Resend("re_5r5b546n_8vwXtD59Fy4sW1kBNcipTb8F"); */

const nodemailer = require("nodemailer");

const mySecret = process.env.SECRET;

const userController = {
  //obtener la informacion de todos los usuarios

  getOneUser: async (req, res, next) => {
    try {
      const indexOfUserToBeConsulted = await User.findById(req.params.id);
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
        msg: `User registered.`,
        success: true,
        userToAdd,
      });
    } catch (error) {
      next(error);
    }
  },

  sendWelcomeEmail: async (req, res) => {
    const user = req.body;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "sedova4029@gmail.com",
        pass: "ilki pcdv qenn pluw",
      },
    });

    try {
      const { info } = await transporter.sendMail({
        from: '"Bikewave" <sedova4029@gmail.com>', // sender address
        to: user.email, // list of receivers
        subject: "Hola desde bikewave", // Subject line
        html: `<h1>Bienvenid@ a bikewave, ${user.firstName}! </h1>`, // html body
      });

      res.status(200).json({ info });
    } catch (error) {
      console.error("Error al enviar el correo electrónico:", error);
      res.status(500).json({
        error: "Hubo un error al enviar el correo electrónico.",
      });
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
        res.status(200).json({
          message: "Bicycle removed from the favorites list.",
          favorites,
        });
      } else {
        // Agregar la bicicleta a la lista de favoritos del usuario
        user.favorites.push(bicycleId);
        await user.save();

        res.status(200).json({
          message: "Bicycle added to the favorites list.",
          favorites,
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

  forgotPassword: async (req, res, next) => {
    const userEmail = req.body.email;

    try {
      const userToBeConsulted = await User.findOne({ email: userEmail });

      if (!userToBeConsulted) {
        return res.status(404).json({ msg: `User not found.` });
      }

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "sedova4029@gmail.com",
          pass: "ilki pcdv qenn pluw",
        },
      });

      const token = jwt.sign(
        { email: userToBeConsulted.email, id: userToBeConsulted._id },
        mySecret,

        {
          expiresIn: "10m",
        }
      );

      const { info } = await transporter.sendMail({
        from: '"Bikewave" <sedova4029@gmail.com>', // sender address
        to: userEmail, // list of receivers
        subject: "Hola desde bikewave", // Subject line
        html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña: 
            <a href="http://localhost:5173/reset-password/${token}">Restablecer Contraseña</a></p>`, // html body
      });

      res.status(200).json({ info, msg: "email sent succesfully" });
    } catch (error) {
      console.error("Error al consultar la base de datos:", error);
      next(error);
    }
  },
  resetPassword: async (req, res, next) => {
    try {
      const token = req.params.token;
      console.log("Reached decoding, token:", token);

      jwt.verify(token, mySecret, async (error, decoded) => {
        if (error) {
          return res
            .status(403)
            .json({ msg: `Invalid token.`, success: false });
        }

        const userId = decoded.id;

        console.log("Decoded user ID:", userId);
        const userSalt = Math.random().toFixed(7);
        const encryptedPassword = await bcrypt.hash(
          req.body.password,
          Number(userSalt)
        );

        try {
          const userToBeChanged = await User.findByIdAndUpdate(
            userId,
            { password: encryptedPassword },
            { new: true }
          );

          console.log("Updated user:", userToBeChanged);
          if (userToBeChanged) {
            res
              .status(200)
              .json({ msg: `User changed. The id is: ${userToBeChanged._id}` });
          } else {
            res
              .status(404)
              .json({ msg: `User with id ${userId} is not found.` });
          }
        } catch (error) {
          next(error);
        }
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
