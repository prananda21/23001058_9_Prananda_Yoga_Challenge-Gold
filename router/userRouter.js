const express = require("express");
const userRouter = express.Router();
const {
  BasicUserController,
  RegisterController,
  LoginController,
} = require("../controller/userController.js");
const methodNotAllowed = (req, res, next) =>
  res.status(405).json({ error: "Method not supported!" });

const internalServerError = (err, req, res, next) => {
  console.log(err);
  res.status(500).json({ error: err.message });
};

userRouter
  .route("/")
  .get(BasicUserController.getAllUsers)
  .all(methodNotAllowed); //DONE

userRouter
  .route("/register")
  .post(RegisterController.postRegisterUser) // DONE
  .all(methodNotAllowed);

userRouter
  .route("/auth")
  .post(LoginController.postLoginUser) // DONE
  .delete(LoginController.deleteLogoutUser)
  .all(methodNotAllowed);
userRouter.use(internalServerError);

userRouter
  .route("/:id")
  .get(BasicUserController.getUserById)
  .all(methodNotAllowed); //DONE

module.exports = userRouter;
