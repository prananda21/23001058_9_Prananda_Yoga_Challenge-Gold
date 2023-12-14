const express = require('express');
const userRouter = express.Router();
const { userController, registerController } = require('../controller/userController.js');

userRouter.route('/')
    .get(userController.getAllUsers)
    
userRouter.route('/:id')
    .get(userController.getUserById)
    .delete(userController.deleteUserById)
     
userRouter.route('/register')
    .post(registerController.postRegisterUser)

userRouter.route('/login')
    .post() //on progress
    .delete()

module.exports = userRouter;