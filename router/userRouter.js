const express = require("express");
const userRouter = express.Router();
const userLogRouter = express.Router();
const {
  BasicUserController,
  registerController,
  loginController,
} = require("../controller/userController.js");

userRouter.route("/").get(BasicUserController.getAllUsers);

userRouter.route("/:id").get(BasicUserController.getUserById);

userRouter.route("/register").post(registerController.postRegisterUser);

userLogRouter
  .route("/auth")
  .post(loginController.postLoginUser)
  .delete(loginController.deleteLogoutUser);

module.exports = [userRouter, userLogRouter];
