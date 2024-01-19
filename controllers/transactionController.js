const Transaction = require("../models/transactionModel");

const transactionController = {
  //obtener la informacion de todas las transacciones
  getTransactions: async (req, res, next) => {
    try {
      const transactionList = await Transaction.find({ email: req.userId });
      res.json(transactionList);
    } catch (error) {
      next(error);
    }
  },
  //obtener la informacion de una transaccion
  getOneTransaction: async (req, res, next) => {
    try {
      const transactionToBeConsulted = req.params.id;
      const indexOfTransactionToBeConsulted = await Transaction.findById(
        transactionToBeConsulted
      );

      // cuando pongo un id aleatorio para que me ejecute el else no me lo ejecuto, me de el error de BSON...
      if (indexOfTransactionToBeConsulted) {
        res.json(await Transaction.find(indexOfTransactionToBeConsulted));
      } else {
        res.status(404).json({
          msg: `Transaction with id ${transactionToBeConsulted} is not found.`,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  //añadir una transaccion
  addTransaction: async (req, res, next) => {
    try {
      const transactionToAdd = new Transaction(req.body);

      await transactionToAdd.save();

      res
        .status(200)
        .json({ msg: `Transaction added. The id is: ${transactionToAdd._id}` });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = transactionController;
