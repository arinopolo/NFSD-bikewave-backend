const express = require("express");
const bicycleController = require("../controllers/bicycleController");
const userController = require("../controllers/userController");
const router = express.Router();

//Routes

router.get("/", bicycleController.getBicycles);
router.get("/:id", bicycleController.getOneBicycle);
router.post("/add", userController.verifyToken, bicycleController.addBicycle);
router.delete("/:id", bicycleController.deleteBicycle);
router.patch("/:id", bicycleController.changeBicycle);

module.exports = router;
