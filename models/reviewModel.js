const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User"  },
    text: { type: String },
    rating: { type: Number, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Bicycle" },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("review", ReviewSchema);

module.exports = Review;
