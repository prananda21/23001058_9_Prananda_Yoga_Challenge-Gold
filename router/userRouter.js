const express = require('express');
const userRouter = express.Router();
const formatResponse = require('../response.js')

let { users } = require('../db/db_users.js');
const { getUserById, getAllUsers, postNewUser, deleteUserById } = require('../handler/userHandler.js');

userRouter.route('/:userId')
    .get(getUserById)

userRouter
    .route('/')
    .get(getAllUsers)
    .post(postNewUser)
    .delete(deleteUserById)

module.exports = userRouter;