const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  price: { type: Number, required: true },
  date: { type: Date, required: true },
  paymentMethod: { type: String, required: true },
  insurance: { type: Boolean, required: true },
  discount: { type: Number },
  //un puente de pago para hacerlo con seguridad
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
