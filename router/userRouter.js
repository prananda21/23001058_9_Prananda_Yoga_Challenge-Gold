const express = require("express");
const userRouter = express.Router();
const {
  BasicUserController,
  RegisterController,
  LoginController,
} = require("../controller/userController.js");

userRouter.route("/").get(BasicUserController.getAllUsers);

userRouter.route("/:id").get(BasicUserController.getUserById);

userRouter.route("/register").post(RegisterController.postRegisterUser);

userRouter
  .route("/auth")
  .post(LoginController.postLoginUser)
  .delete(LoginController.deleteLogoutUser);

module.exports = userRouter;
