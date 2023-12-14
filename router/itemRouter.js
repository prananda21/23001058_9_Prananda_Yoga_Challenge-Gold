const express = require('express');
const itemRouter = express.Router();
const { itemController } = require('../controller/itemController.js');

itemRouter.route('/:itemId')
    .get(itemController.getItemById)

itemRouter
    .route('/')
    .get(itemController.getAllItem)
    .post(itemController.postNewItem);

module.exports = itemRouter;