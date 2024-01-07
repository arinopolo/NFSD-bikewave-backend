const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    secondName: { type: String, required: true },
    //pedir DNI???
    description: { type: String },
    location: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    profilePicture: { type: String },
    rating: { type: mongoose.Schema.Types.ObjectId, ref: "Rating" },
    bicycles: { type: mongoose.Schema.Types.ObjectId, ref: "Bicycle" },
    rentals: [
      {
        bicycleId: { type: mongoose.Schema.Types.ObjectId, ref: "Bicycle" },
        startDate: { type: Date },
        endDate: { type: Date },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", UserSchema);

module.exports = User;
