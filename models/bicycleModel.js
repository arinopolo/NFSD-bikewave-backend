const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bicycleSchema = new Schema(
  {
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    isFav: { type: Boolean, default: false },
    category: { type: String },
    model: { type: String },
    photo: { type: String },
    description: { type: String },
    riderHeight: { type: Number },
    wheelDiameter: { type: Number },
    deposit: { type: Number },
    rating: { type: Schema.Types.ObjectId, ref: "Review" },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Bicycle = mongoose.model("Bicycle", bicycleSchema);

module.exports = Bicycle;
