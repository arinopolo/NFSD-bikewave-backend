const Bicycle = require("../models/bicycleModel");

const bicycleController = {
  //obtener la informacion de todas las bicicletas
  getBicycles: async (req, res, next) => {
    try {
      const bicycleList = await Bicycle.find();
      res.json(bicycleList);
    } catch (error) {
      next(error);
    }
  },
  //obtener la informacion de una bicicleta
  getOneBicycle: async (req, res, next) => {
    try {
      const bicycleToBeConsulted = req.params.id;
      const indexOfBicycleToBeConsulted = await Bicycle.findById(
        bicycleToBeConsulted
      );

      // cuando pongo un id aleatorio para que me ejecute el else no me lo ejecuto, me de el error de BSON...
      if (indexOfBicycleToBeConsulted) {
        res.json(await Bicycle.find(indexOfBicycleToBeConsulted));
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
      const bicycleToAdd = new Bicycle(req.body);

      await bicycleToAdd.save();

      res
        .status(200)
        .json({ msg: `Bicycle added. The id is: ${bicycleToAdd._id}` });
    } catch (error) {
      next(error);
    }
  },
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
