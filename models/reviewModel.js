const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User" },
    text: { type: String },
    rating: { type: Number, required: true },
    product: { type: Schema.Types.ObjectId, ref: "Bicycle" },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
