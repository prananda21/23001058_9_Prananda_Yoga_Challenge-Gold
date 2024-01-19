const { formatResponse } = require("../response.js");
const itemsData = require("../db/db_items.json");
const fs = require("fs");
const generateDate = require("../helper/generateDate.js");

class ItemController {
  static getAllItem(req, res) {
    let message = "Success";
    res.status(200).json(formatResponse(itemsData, message));
  }

  static getItemById(req, res) {
    let id = +req.params.id;
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

  static postNewItem(req, res) {
    const { name, price, stock } = req.body;

    let data = {
      id: itemsData.length + 1,
      name: name,
      price: price,
      stock: stock,
      createdAt: generateDate(),
      updatedAt: generateDate(),
    };

    let message = "Success";

    itemsData.push(data);
    fs.writeFileSync("./db/db_items.json", JSON.stringify(itemsData), "utf-8");
    res.status(201).json(formatResponse(data, message));
  }

  static updateQtyItem(req, res) {
    const id = +req.params.id;
    const stock = req.body.stock;
    const findItem = itemsData.find((i) => i.id === +id);

    let data = {
      id: findItem?.id,
      name: findItem?.name,
      price: findItem?.price,
      stock: findItem?.stock,
      createdAt: findItem?.createdAt,
      updatedAt: findItem?.updatedAt,
    };

    try {
      for (const i in itemsData) {
        if (findItem.id === itemsData[i].id) {
          data.id = +id;
          data.stock = stock;
          data.updatedAt = generateDate();

          let itemTarget = itemsData.findIndex((i) => i.id === +id);

          itemsData.splice(itemTarget, 1, data);
          fs.writeFileSync(
            "./db/db_items.json",
            JSON.stringify(itemsData),
            "utf-8"
          );

          return res.status(200).json(formatResponse(data, "Success!"));
        }
      }
    } catch (error) {
      return res.json(
        formatResponse(null, "Item tidak ditemukan, coba item lain!")
      );
    }
  }
}

module.exports = { ItemController };
