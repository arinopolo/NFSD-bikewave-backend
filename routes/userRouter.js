const express = require("express");
const userController = require("../controllers/userController");
const chatController = require("../controllers/chatController");
const router = express.Router();

//Routes
router.get(
  "/favorites",
  userController.verifyToken,
  userController.getFavorites
);
router.patch(
  "/favorites/:id",
  userController.verifyToken,
  userController.addAndDeleteFavorites
);

router.get(
  "/mybicycles",
  userController.verifyToken,
  userController.getMyBicycles
);
router.get("/:id", userController.getOneUser);
router.post("/", userController.addUser);
router.post("/login", userController.loginUser);
router.post("/send-email", userController.sendWelcomeEmail);
router.delete("/:id", userController.deleteUser);
router.patch("/:id", userController.changeUser);
router.put(
  "/forgot-password",

  userController.forgotPassword
);
router.put("/reset-password/:token", userController.resetPassword);
router.put(
  "/book/:bicycleId",
  userController.verifyToken,
  userController.bookBicycle
);
router.put(
  "/change-password",
  userController.verifyToken,
  userController.changePassword
);

module.exports = router;
