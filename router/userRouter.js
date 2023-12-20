const express = require("express");
const userRouter = express.Router();
const {
	userController,
	registerController,
	loginController,
} = require("../controller/userController.js");

userRouter.route("/").get(userController.getAllUsers);

userRouter
	.route("/:id")
	.get(userController.getUserById)
	.delete(userController.deleteUserById);

userRouter.route("/register").post(registerController.postRegisterUser);

userRouter.route("/login").post(loginController.postLoginUser);

userRouter.route("logout").delete(loginController.deleteLoginUser);

module.exports = userRouter;
