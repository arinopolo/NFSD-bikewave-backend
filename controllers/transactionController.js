const Transaction = require("../models/transactionModel");

const transactionController = {
  //obtener la informacion de todas las transacciones
  getTransactions: async (req, res, next) => {
    try {
      const transactionList = await Transaction.find();
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
        res
          .status(404)
          .send(
            `Transaction with id ${transactionToBeConsulted} is not found.`
          );
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

      res.send(`Transaction added. The id is: ${transactionToAdd}`);
    } catch (error) {
      next(error);
    }
  },
  //eliminar una transaccion
  deleteTransaction: async (req, res, next) => {
    try {
      const transactionToBeDeleted = req.params.id;
      const indexToBeDeleted = await Transaction.findById(
        transactionToBeDeleted
      );

      if (indexToBeDeleted) {
        await Transaction.deleteOne({ _id: indexToBeDeleted });
        res.send(`Transaction deleted. The id is:  ${transactionToBeDeleted}`);
      } else {
        res
          .status(404)
          .send(`Transaction with id ${transactionToBeDeleted} is not found.`);
      }
    } catch (error) {
      next(error);
    }
  },
  //cambiar una transaccion
  changeTransaction: async (req, res, next) => {
    try {
      const idToBeChanged = req.params.id;

      const newData = req.body;

      let transactionToBeChanged = await Transaction.findByIdAndUpdate(
        idToBeChanged,
        newData,
        { new: true }
      );

      if (transactionToBeChanged) {
        res.send(`Transaction changed. The id is: ${transactionToBeChanged}`);
      } else {
        res
          .status(404)
          .send(`Transaction with id ${transactionToBeChanged} is not found.`);
      }
    } catch (error) {
      next(error);
    }
  },
};

module.exports = transactionController;
