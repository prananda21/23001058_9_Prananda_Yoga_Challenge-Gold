const express = require('express');
const itemRouter = express.Router();

let {items} = require('../db/db_items.js');
const { getAllItem, getItemById, postNewItem } = require('../handler/itemHandler.js');

itemRouter.get('/:itemId', getItemById);

itemRouter
    .route('/')
    .get(getAllItem)
    .post(postNewItem);

module.exports = itemRouter;