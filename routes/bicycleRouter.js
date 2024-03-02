const express = require("express");
const bicycleController = require("../controllers/bicycleController");
const userController = require("../controllers/userController");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

//Routes

router.get("/", bicycleController.getBicycles);
router.get("/:id", bicycleController.getOneBicycle);
router.post(
  "/add",
  upload.single("photo"),
  userController.verifyToken,
  bicycleController.addBicycle
);
router.delete(
  "/:id",
  userController.verifyToken,
  bicycleController.deleteBicycle
);
router.patch("/:id", bicycleController.changeBicycle);

module.exports = router;
