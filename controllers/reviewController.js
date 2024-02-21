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
          .json({ msg: `Review with id ${reviewToBeConsulted} is not found.` });
      }
    } catch (error) {
      next(error);
    }
  },
  // agregar una reseña
  addReview: async (req, res, next) => {
    try {
      const reviewToAdd = new Review(req.body);

      await reviewToAdd.save();

      res
        .status(200)
        .json({ msg: ` Review added. The id is:${reviewToAdd._id}` });
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
        res
          .status(200)
          .json({ msg: `Review deleted. The id is: ${reviewToBeDeleted}` });
      } else {
        res
          .status(404)
          .json({ msg: `Review with id ${reviewToBeDeleted} is not found.` });
      }
    } catch (error) {
      next(error);
    }
  },
};

module.exports = reviewController;
