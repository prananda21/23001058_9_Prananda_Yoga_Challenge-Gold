const express = require('express');
const userRouter = express.Router();

const {formatResponse} = require('../response.js');
let {users} = require('../db/db_users.js');
const { getAllItem } = require('../handler/itemHandler.js');

userRouter.get('/:userId', getAllItem);

userRouter
    .route('/')
    .get((req, res) => {
        let message = 'Success';
        res.status(200).json(formatResponse(users, message))
    })

    .post((req, res) => {
        let data = {
            id: users[users.length -1].id + 1,
            name: req.body.name,
            email: req.body.email,
        };

        users.push(data);

        res.status(201).json(formatResponse(data, 'Success'))
    });

module.exports = userRouter;