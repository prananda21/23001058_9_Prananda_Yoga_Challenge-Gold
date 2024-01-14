const { formatResponse } = require("../response.js");
const items = require("../db/db_items.json");
const fs = require("fs");
const generateId = require("../helper/generateId.js");

class itemController {
  static getAllItem(req, res) {
    let message = "Success";
    res.status(200).json(formatResponse(items, message));
  }

  static getItemById(req, res) {
    let id = req.params.id;
    let data = {};
    let message = "Success";
    let isUserFound = false;

    for (let i = 0; i < items.length; i++) {
      if (items[i].id === id) {
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
        .json(formatResponse(null, `Product with id ${id} not found`));
    }
  }

  static async postNewItem(req, res) {
    generateId().then((id) => {
      let data = {
        id: "ITEM_" + id,
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock,
      };

      let message = "Success";

      items.push(data);
      fs.writeFileSync("./db/db_items.json", JSON.stringify(items), "utf-8");
      res.status(201).json(formatResponse(data, message));
    });
  }
}

module.exports = { itemController };
