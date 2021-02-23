const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const userRoutes = express.Router();


userRoutes.get("/", authController.protect, userController.getAllUsers);

userRoutes.post("/signup", authController.createUser);

userRoutes.post("/login", authController.login);

userRoutes.get("/logout", authController.logout);




module.exports = userRoutes;