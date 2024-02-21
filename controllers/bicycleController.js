const Bicycle = require("../models/bicycleModel");
const User = require("../models/userModel");
const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: "du6tcqzpu",
  api_key: "438824242274272",
  api_secret: "aMIB0AIfwoBe1dcP23w_eZxkI5Y",
});

const bicycleController = {
  //obtener la informacion de todas las bicicletas
  getBicycles: async (req, res, next) => {
    try {
      let filter = {};

      if (req.query.category) {
        filter.category = req.query.category;
      }

      if (req.query.minPrice && req.query.maxPrice) {
        filter.price = {
          $gt: req.query.minPrice,
          $lt: req.query.maxPrice,
        };
      }

      if (req.query.location) {
        filter.location = req.query.location.toLowerCase();
      }

      const bicycleList = await Bicycle.find(filter);
      res.json(bicycleList);
    } catch (error) {
      next(error);
    }
  },
  //obtener la informacion de una bicicleta
  getOneBicycle: async (req, res, next) => {
    try {
      const bicycleToBeConsulted = req.params.id;
      const bicycleFound = await Bicycle.findById(
        bicycleToBeConsulted
      ).populate("owner");

      if (bicycleFound) {
        res.json(bicycleFound);
      } else {
        res.status(404).json({
          msg: `Bicycle with id ${bicycleToBeConsulted} is not found.`,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  // agregar una bicicleta
  addBicycle: async (req, res, next) => {
    try {
      if (req.file) {
        // subo la imagen a Cloudinary
        const imageB64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = "data:" + req.file.mimetype + ";base64," + imageB64;
        const imageRes = await cloudinary.uploader.upload(dataURI, {
          resource_type: "auto",
        });

        req.body.photo = imageRes.secure_url;
      }

      const data = {
        ...req.body,
        owner: req.userId,
      };
      const bicycleToAdd = new Bicycle(data);

      await bicycleToAdd.save();

      // se guarda la bicicleta en el modelo de usuario como su rental
      const user = await User.findById(req.userId);
      user.bicycles.push(bicycleToAdd);
      await user.save();

      res.status(200).json({
        msg: `Bicycle added. The id is: ${bicycleToAdd._id}`,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  },

  /*addImage: async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(500).json({ error: "file not found" });
      }
      console.log(req.file.buffer);
      const imageB64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = "data:" + req.file.mimetype + ";base64," + imageB64;
      const imageRes = await cloudinary.uploader.upload(dataURI, {
        resource_type: "auto",
      });
      console.log(imageRes);
      res.json({ image: "uploaded " });
    } catch (error) {
      next(error);
    }
  },
  */

  //eliminar una bicicleta
  deleteBicycle: async (req, res, next) => {
    try {
      const bicycleToBeDeleted = req.params.id;
      const indexToBeDeleted = await Bicycle.findById(bicycleToBeDeleted);

      if (indexToBeDeleted) {
        await Bicycle.deleteOne({ _id: indexToBeDeleted });
        res
          .status(200)
          .json({ msg: `Bicycle deleted. The id is: ${bicycleToBeDeleted}` });
      } else {
        res
          .status(404)
          .json({ msg: `Bicycle with id ${bicycleToBeDeleted} is not found.` });
      }
    } catch (error) {
      next(error);
    }
  },
  // cambiar informacion de una bicicleta
  changeBicycle: async (req, res, next) => {
    try {
      const idToBeChanged = req.params.id;

      const newData = req.body;

      let bicycleToBeChanged = await Bicycle.findByIdAndUpdate(
        idToBeChanged,
        newData,
        { new: true }
      );

      if (bicycleToBeChanged) {
        res
          .status(200)
          .json({ msg: `Bicycle changed. The id is: ${bicycleToBeChanged}` });
      } else {
        res
          .status(404)
          .json({ msg: `Bicycle with id ${bicycleToBeChanged} is not found.` });
      }
    } catch (error) {
      next(error);
    }
  },
};

module.exports = bicycleController;
