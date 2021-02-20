const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const userRoutes = express.Router();


userRoutes.get("/", userController.getAllUsers);

userRoutes.post("/signup", authController.createUser);

userRoutes.post("/login", authController.login);




module.exports = userRoutes;