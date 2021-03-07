const express = require("express");
const postController = require("../controllers/postController");
const authController = require("../controllers/authController");
const postRoutes = express.Router();




postRoutes.get("/", authController.protect, postController.getAllPost);

postRoutes.post("/", authController.protect, postController.createPost);

postRoutes.post("/search", authController.protect, postController.searchPost);

postRoutes.patch("/", authController.protect, postController.likePost);

postRoutes.delete("/", authController.protect, postController.deletePost);


module.exports = postRoutes;