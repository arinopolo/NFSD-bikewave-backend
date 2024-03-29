const express = require("express");
const transactionController = require("../controllers/transactionController");
const userController = require("../controllers/userController");
const router = express.Router();

//Routes

router.get(
  "/",
  userController.verifyToken,
  transactionController.getTransactions
);
router.get("/:id", transactionController.getOneTransaction);
router.post("/", transactionController.addTransaction);


module.exports = router;
