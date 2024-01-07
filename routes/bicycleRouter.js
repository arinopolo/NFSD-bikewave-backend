const express = require("express");
const bicycleController = require("../controllers/bicycleController");
const router = express.Router();

//Routes

router.get("/", bicycleController.getBicycles);
router.get("/:id", bicycleController.getOneBicycle);
router.post("/", bicycleController.addBicycle);
router.delete("/:id", bicycleController.deleteBicycle);
router.patch("/:id", bicycleController.changeBicycle);

module.exports = router;
