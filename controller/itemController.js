const { formatResponse } = require("../response.js");
const items = require("../db/db_items.json");
const generateId = require("../helper/generateId.js");

class itemController {
  static getAllItem(req, res) {
    let message = "Success";
    res.status(200).json(formatResponse(items, message));
  }

  static getItemById(req, res) {
    let data = {};
    let message = "Success";
    let isUserFound = false;

    let id = req.params.itemId;

    for (let i = 0; i < items.length; i++) {
      if (items[i].id === +id) {
        data = items[i];
        isUserFound = true;
        break;
      }
    }

    if (isUserFound) {
      res.status(200).json(formatResponse(data, message));
    } else {
      res
        .status(404)
        .json(formatResponse(data, `Product with id ${id} not found`));
    }
  }

  static postNewItem(req, res) {
    let data = {
      id: generateId(),
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
    };

    items.push(data);
    res.status(201).json(formatResponse(data, "Success"));
  }
}

module.exports = { itemController };
