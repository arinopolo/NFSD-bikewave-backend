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
            `No se ha encontrado la transaccion con el id: ${transactionToBeConsulted}`
          );
      }
    } catch (error) {
      next(error);
    }
  },
  //añadir una transaccion
  addTransaction: async (req, res, next) => {
    try {
      const data = req.body;
      const transactionToAdd = new Transaction({
        ...data,
      });

      await transactionToAdd.save();

      res.send(
        `text: La transacción guardada con exito! La transacción es: ${transactionToAdd}`
      );
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
        res.send(
          `text: La transacción eliminada con exito! El id de la transacción es:  ${transactionToBeDeleted}`
        );
      } else {
        res
          .status(404)
          .send(
            `text: No se ha encontrado la transacción con id: ${transactionToBeDeleted}`
          );
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
        res.send(
          `text: Se ha cambiado con éxito la transacción con id: ${transactionToBeChanged}`
        );
      } else {
        res
          .status(404)
          .send(
            `text: No se ha encontrado la transacción con id: ${transactionToBeChanged}`
          );
      }
    } catch (error) {
      next(error);
    }
  },
};

module.exports = transactionController;
