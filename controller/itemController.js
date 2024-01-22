const { formatResponse } = require("../response.js");
const { Item } = require("../models");

class ItemController {
  static async getAllItem(req, res) {
    let message = "Success";
    let statusCode = 201;

    try {
      const items = await Item.findAll({});
      if (items.length === 0) {
        throw new Error("Database is empty!");
      } else {
        return res.status(statusCode).json({ items, message });
      }
    } catch (error) {
      statusCode = 404;
      return res.status(statusCode).json(error.message);
    }
  }

  static async getItemById(req, res) {
    let id = +req.params.id;
    let statusCode = 200;
    let message = "Success";

    try {
      const itembyId = await Item.findByPk(id);
      if (!itembyId) {
        throw new Error(`Item with Id ${id} not found!`);
      } else {
        return res.status(statusCode).json({ itembyId, message });
      }
    } catch (error) {
      statusCode = 404;
      return res.status(statusCode).json(error.message);
    }
  }

  static async postNewItem(req, res) {
    const { name, price, stock } = req.body;
    let statusCode = 201;
    let message = "Success";

    try {
      const itemCreate = await Item.create({
        name: name,
        price: price,
        stock: stock,
      });
      return res.status(statusCode).json(formatResponse(itemCreate, message));
    } catch (error) {
      statusCode = 400;
      message = "Something went wrong!";
      res.status(statusCode).json({ message, error });
    }
  }

  static async updateQtyItem(req, res) {
    const id = +req.params.id;
    const stock = req.body.stock;
    let statusCode = 201;
    let message = "Success!";

    try {
      const itembyId = await Item.findByPk(id);
      if (itembyId?.dataValues?.id !== id) {
        throw new Error(`Item with Id ${id} not found!`);
      }

      const updateItem = await Item.update(
        { stock: stock, updatedAt: new Date() },
        { where: { id: id } }
      );

      const data = await Item.findByPk(id);

      return res.status(statusCode).json({ data, message });
    } catch (error) {
      statusCode = 404;
      return res.status(statusCode).json(error.message);
    }
  }
}

module.exports = { ItemController };
