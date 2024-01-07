const Review = require("../models/reviewModel");

const reviewController = {
  //obtener la informacion de todas las bicicletas
  getReviews: async (req, res, next) => {
    try {
      const reviewList = await Review.find();
      res.json(reviewList);
    } catch (error) {
      next(error);
    }
  },
  //obtener la informacion de una bicicleta
  getOneReview: async (req, res, next) => {
    try {
      const reviewToBeConsulted = req.params.id;
      const indexOfReviewToBeConsulted = await Review.findById(
        reviewToBeConsulted
      );

      // cuando pongo un id aleatorio para que me ejecute el else no me lo ejecuto, me de el error de BSON...
      if (indexOfReviewToBeConsulted) {
        res.json(await Review.find(indexOfReviewToBeConsulted));
      } else {
        res
          .status(404)
          .send(
            `No se ha encontrado el producto con el id: ${reviewToBeConsulted}`
          );
      }
    } catch (error) {
      next(error);
    }
  },
  // agregar una bicicleta
  addReview: async (req, res, next) => {
    try {
      const data = req.body;
      const reviewToAdd = new Review({
        ...data,
      });

      await reviewToAdd.save();

      res.send(
        `text:  Review agregado con exito! El review es: ${reviewToAdd}`
      );
    } catch (error) {
      next(error);
    }
  },
  //eliminar una bicicleta
  deleteReview: async (req, res, next) => {
    try {
      const reviewToBeDeleted = req.params.id;
      const indexToBeDeleted = await Review.findById(reviewToBeDeleted);

      if (indexToBeDeleted) {
        await Review.deleteOne({ _id: indexToBeDeleted });
        res.send(
          `text: Review eliminado con éxito! El id del review es: ${reviewToBeDeleted}`
        );
      } else {
        res
          .status(404)
          .send(
            `text: No se ha encontrado el review con id: ${reviewToBeDeleted}`
          );
      }
    } catch (error) {
      next(error);
    }
  },
  // cambiar informacion de una bicicleta
  changeReview: async (req, res, next) => {
    try {
      const idToBeChanged = req.params.id;
      const newData = req.body;

      let reviewToBeChanged = await Review.findByIdAndUpdate(
        idToBeChanged,
        newData,
        { new: true }
      );

      if (reviewToBeChanged) {
        res.send(
          `text: Has cambiado con éxito tu review con id: ${reviewToBeChanged}`
        );
      } else {
        res
          .status(404)
          .send(
            `text: No se ha encontrado el review con id: ${reviewToBeChanged}`
          );
      }
    } catch (error) {
      next(error);
    }
  },
};

module.exports = reviewController;
