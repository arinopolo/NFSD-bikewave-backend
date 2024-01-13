const express = require("express");
const reviewController = require("../controllers/reviewController");
const router = express.Router();

//Routes

router.get("/", reviewController.getReviews);
router.get("/:id", reviewController.getOneReview);
router.post("/", reviewController.addReview);
router.delete("/:id", reviewController.deleteReview);
router.patch("/:id", reviewController.changeReview);

module.exports = router;
