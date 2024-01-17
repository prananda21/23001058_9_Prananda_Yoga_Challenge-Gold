const { formatResponse } = require("../response.js");
const itemsData = require("../db/db_items.json");
const fs = require("fs");
const generateId = require("../helper/generateId.js");
const generateDate = require("../helper/generateDate.js");

class itemController {
  static getAllItem(req, res) {
    let message = "Success";
    res.status(200).json(formatResponse(itemsData, message));
  }

  static getItemById(req, res) {
    let id = req.params.id;
    let data = {};
    let message = "Success";
    let isItemFound = false;

    for (let i = 0; i < itemsData.length; i++) {
      if (itemsData[i].id === id) {
        data = itemsData[i];
        isItemFound = true;
        break;
      }
    }

    if (isItemFound) {
      res.status(200).json(formatResponse(data, message));
    } else {
      res
        .status(404)
        .json(formatResponse(null, `Item with id ${id} not found`));
    }
  }

  static async postNewItem(req, res) {
    generateId().then((id) => {
      const { name, price, stock } = req.body;

      let data = {
        id: "ITEM_" + id,
        name: name,
        price: price,
        stock: stock,
        createdAt: generateDate(),
        updatedAt: null,
      };

      let message = "Success";

      itemsData.push(data);
      fs.writeFileSync(
        "./db/db_items.json",
        JSON.stringify(itemsData),
        "utf-8"
      );
      res.status(201).json(formatResponse(data, message));
    });
  }
}

module.exports = { itemController };
