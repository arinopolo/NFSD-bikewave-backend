const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

//Routes
router.get(
  "/favorites",
  userController.verifyToken,
  userController.getFavorites
);
router.post(
  "/favorites/:id",
  userController.verifyToken,
  userController.addToFavorites
);
router.get("/:id", userController.verifyToken, userController.getOneUser);
router.post("/", userController.addUser);
router.post("/login", userController.loginUser);
router.delete("/:id", userController.deleteUser);
router.patch("/:id", userController.changeUser);

module.exports = router;
