const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bicycleSchema = new Schema(
  {
    brand: { type: String, required: true },
    model: { type: String },
    description: { type: String },
    price: { type: Number, required: true },
    location: { type: String, required: true },
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
