const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

//Routes

router.get("/", userController.getUsers);
router.get("/:id", userController.getOneUser);
router.post("/", userController.addUser);
router.post("/login", userController.checkUser);
router.post("/refreshtoken", userController.refreshToken);
router.delete("/:id", userController.deleteUser);
router.patch("/:id", userController.changeUser);

module.exports = router;
