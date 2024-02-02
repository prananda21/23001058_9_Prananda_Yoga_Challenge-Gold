const express = require("express");
const userRouter = express.Router();
const {
  BasicUserController,
  RegisterController,
  LoginController,
} = require("../controller/userController.js");
const methodNotAllowed = (req, res, next) => {
  try {
    throw new Error("Method not supported!");
  } catch (error) {
    res.status(405).json(error.message);
  }
};

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
  .all(methodNotAllowed);

userRouter
  .route("/auth/:id")
  .delete(LoginController.deleteLogoutUser)
  .all(methodNotAllowed);
userRouter.use(internalServerError);

userRouter
  .route("/:id")
  .get(BasicUserController.getUserById)
  .all(methodNotAllowed); //DONE

module.exports = userRouter;
