const express = require("express");
const postController = require("../controllers/postController");
const authController = require("../controllers/authController");
const postRoutes = express.Router();



postRoutes.get("/", authController.protect, postController.getAllPost);

postRoutes.post("/", authController.protect, postController.createPost);


module.exports = postRoutes;