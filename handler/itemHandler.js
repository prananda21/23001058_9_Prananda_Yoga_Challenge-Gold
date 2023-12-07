const {formatResponse} = require('../response.js');
const {items} = require('../db/db_items.js')

const getItemById = (req, res) => {
    let data = {};
    let message = 'Success';
    let isUserFound = false;

    let id = req.params.itemId;

    for (let i = 0; i < items.length; i++){
        if (items[i].id === +id){
            data = items[i];
            isUserFound = true;
            break;
        }
    }

    if (isUserFound) {
        res.status(200).json(formatResponse(data, message));
    } else {
        res.status(404).json(formatResponse(data, `Product with id ${id} not found`))
    }
}

const getAllItem = (req, res) => {
    let message = 'Success';
    res.status(200).json(formatResponse(items, message));
}

const postNewItem = (req, res) => {
    let data = {
        id: items[items.length -1].id + 1,
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity
    };

    items.push(data);

    res.status(201).json(formatResponse(data, 'Success'))
}

module.exports = { getItemById, getAllItem, postNewItem }