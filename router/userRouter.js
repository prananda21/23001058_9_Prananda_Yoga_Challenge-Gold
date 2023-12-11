const express = require('express');
const userRouter = express.Router();
const { userController, registerController } = require('../controller/userController.js');

userRouter.route('/:userId')
    .get(userController.getUserById)
    .delete(userController.deleteUserById) // bug need to fix ASAP

userRouter.route('/')
    .get(userController.getAllUsers)
    
userRouter.route('/register')
    .post(registerController.postRegisterUser)

userRouter.route('/login')
    .post()
    .delete()

module.exports = userRouter;