const express = require("express");
const transactionController = require("../controllers/transactionController");
const router = express.Router();

//Routes

router.get("/", transactionController.getTransactions);
router.get("/:id", transactionController.getOneTransaction);
router.post("/", transactionController.addTransaction);
//router.delete("/:id", transactionController.deleteTransaction);
//router.patch("/:id", transactionController.changeTransaction);

module.exports = router;
