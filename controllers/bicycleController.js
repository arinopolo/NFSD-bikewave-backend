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
        res
          .status(404)
          .send(
            `No se ha encontrado el producto con el id: ${bicycleToBeConsulted}`
          );
      }
    } catch (error) {
      next(error);
    }
  },
  // agregar una bicicleta
  addBicycle: async (req, res, next) => {
    try {
      const data = req.body;
      const bicycleToAdd = new Bicycle({
        ...data,
      });

      await bicycleToAdd.save();

      res.send(
        `text:  Producto agregado con exito! El producto es: ${bicycleToAdd}`
      );
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
        res.send(
          `text: Producto eliminado con éxito! El id del producto es: ${bicycleToBeDeleted}`
        );
      } else {
        res
          .status(404)
          .send(
            `text: No se ha encontrado el producto con id: ${bicycleToBeDeleted}`
          );
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
        res.send(
          `text: Has cambiado con éxito tu producto con id: ${bicycleToBeChanged}`
        );
      } else {
        res
          .status(404)
          .send(
            `text: No se ha encontrado el producto con id: ${bicycleToBeChanged}`
          );
      }
    } catch (error) {
      next(error);
    }
  },
};

module.exports = bicycleController;
