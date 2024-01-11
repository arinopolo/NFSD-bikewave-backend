const Review = require("../models/reviewModel");

const reviewController = {
  //obtener la informacion de todas las reseñas
  getReviews: async (req, res, next) => {
    try {
      const reviewList = await Review.find();
      res.json(reviewList);
    } catch (error) {
      next(error);
    }
  },
  //obtener la informacion de una reseña
  getOneReview: async (req, res, next) => {
    try {
      const reviewToBeConsulted = req.params.id;
      const indexOfReviewToBeConsulted = await Review.findById(
        reviewToBeConsulted
      );

      if (indexOfReviewToBeConsulted) {
        res.json(await Review.find(indexOfReviewToBeConsulted));
      } else {
        res
          .status(404)
          .send(`Bicycle with id ${reviewToBeConsulted} is not found.`);
      }
    } catch (error) {
      next(error);
    }
  },
  // agregar una reseña
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
  //eliminar una reseña
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
  // cambiar informacion de una reseña
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
