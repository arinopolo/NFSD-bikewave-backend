const User = require("../models/userModel");
const Bicycle = require("../models/bicycleModel");
const Chat = require("../models/chatModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const myFrontend = process.env.FRONTEND;
const nodemailEmail = process.env.NODEMAILEMAIL;
const nodemailPas = process.env.NODEMAILPAS;

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
        user: nodemailEmail,
        pass: nodemailPas,
      },
    });

    try {
      const { info } = await transporter.sendMail({
        from: `"Bikewave" <${nodemailEmail}>`,
        to: user.email, // list of receivers
        subject: "Hola desde bikewave", // Subject line
        html: `<h1>Bienvenid@ a bikewave, ${user.firstName}! </h1> <p>¡Qué emocionante tenerte con nosotros en la comunidad ciclista! 😊 </p>
        <p>Prepárate para vivir aventuras sobre dos ruedas y descubrir nuevas rutas junto a otros apasionados del ciclismo como tú.</p>
<p>En nuestra app, encontrarás bicis listas para rodar y una comunidad lista para explorar. Si tienes alguna duda o solo quieres charlar sobre ciclismo, ¡aquí estamos para ayudarte!
        </p>
       <p>¡Nos vemos pedaleando pronto!</p> 
        
       <p> El equipo de Bikewave.</p> `, // html body
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
      console.log(user);
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
        from: '"Bikewave" <${bikawaveEmail}>', // sender address
        to: userEmail, // list of receivers
        subject: "Restablecer tu contraseña de bikewave", // Subject line
        html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña: 
            <a href="${myFrontend}/reset-password/${token}">Restablecer Contraseña</a></p>`, // html body
      });

      res
        .status(200)
        .json({ info, msg: "email sent succesfully", success: true });
    } catch (error) {
      console.error("Error al consultar la base de datos:", error);
      next(error);
    }
  },
  resetPassword: async (req, res, next) => {
    const token = req.params.token;
    console.log("Token decodificado:", token);

    try {
      const decoded = jwt.verify(token, mySecret);
      const userId = decoded.id;

      console.log("ID de usuario decodificado:", userId);
      const userSalt = Math.random().toFixed(7);
      const encryptedPassword = await bcrypt.hash(
        req.body.password,
        Number(userSalt)
      );

      const userToBeChanged = await User.findByIdAndUpdate(
        userId,
        { password: encryptedPassword },
        { new: true }
      );

      if (userToBeChanged) {
        res.status(200).json({
          msg: `La contraseña del usuario se ha cambiado. El ID es: ${userToBeChanged._id}`,
          success: true,
        });
      } else {
        res
          .status(404)
          .json({ msg: `No se encontró un usuario con el ID ${userId}.` });
      }
    } catch (error) {
      console.error("Error al consultar la base de datos:", error);
      next(error);
    }
  },

  bookBicycle: async (req, res, next) => {
    const userId = req.userId;
    const bicycleId = req.params.bicycleId;
    const ownerId = req.body.ownerId;

    console.log(userId, bicycleId, ownerId);

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
      const user = await User.findById(userId);
      const bicycle = await Bicycle.findById(bicycleId);
      const owner = await User.findById(ownerId);

      if (!user || !bicycle || !owner) {
        return res.status(404).json({ msg: `Not found.` });
      }

      user.rentals.push(bicycle._id);
      await user.save();

      const { info } = await transporter.sendMail({
        from: '"Bikewave" <sedova4029@gmail.com>', // sender address
        to: user.email, // list of receivers
        subject: " Detalles de tu nueva reserva!", // Subject line
        html: `<h1>Hola, ${user.firstName}! </h1>
        <p>¡Gracias por tu reserva! Aquí tienes los detalles</p>
        <p> La marca de la bicicleta que has reservado: ${bicycle.brand}</p>
        <p>El modelo : ${bicycle.model}</p>
        <p>El precio : ${bicycle.price} €/dia</p>
        <p>Presiona en el siguiente enlace para abrir el chat con el propietario: </p>
        <a  href="${myFrontend}/chats/">Contactar</a>`, // html body
      });

      res.status(200).json({ info, success: true });
    } catch (error) {
      res.status(500).json({
        error: "Hubo un error al enviar el correo electrónico.",
        success: false,
      });
    }
  },

  changePassword: async (req, res, next) => {
    try {
      //desencriptar la contraseña

      const oldPassword = req.body.oldPassword;
      const userId = req.userId;
      const newPassword = req.body.newPassword;

      const userInfo = await User.findById(userId);

      const isPasswordValid = await bcrypt.compare(
        oldPassword,
        userInfo.password
      );

      if (isPasswordValid) {
        const newEncryptedPassword = await bcrypt.hash(
          newPassword,
          Number(userInfo.salt)
        );

        userInfo.password = newEncryptedPassword;
        await userInfo.save();

        res.status(200).json({
          msg: `Password changed .`,
          success: true,
          userInfo,
        });
      } else {
        res.status(400).json({
          msg: `Passwords dont match.`,
          success: false,
        });
      }
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
