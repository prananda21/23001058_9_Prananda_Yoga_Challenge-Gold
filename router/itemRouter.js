const express = require('express');
const itemRouter = express.Router();

const {formatResponse} = require('../response.js');
let {items} = require('../db/db_items.js');
const { getAllItem } = require('../handler/itemHandler.js');

itemRouter.get('/:productId', getAllItem);

itemRouter
    .route('/')
    .get((req, res) => {
        let message = 'Success';
        res.status(200).json(formatResponse(items, message));
    })

    .post((req, res) => {
        let data = {
            id: items[items.length -1].id + 1,
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity
        };

        items.push(data);

        res.status(201).json(formatResponse(data, 'Success'))
    });

module.exports = itemRouter;