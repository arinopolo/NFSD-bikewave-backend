const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: Number, required: true },
    firstName: { type: String, required: true },
    secondName: { type: String, required: true },
    //pedir DNI???
    description: { type: String },
    location: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    profilePicture: { type: String },
    bicycles: { type: Schema.Types.ObjectId, ref: "Bicycle" },
    rentals: [
      {
        bicycleId: { type: Schema.Types.ObjectId, ref: "Bicycle" },
        startDate: { type: Date },
        endDate: { type: Date },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
