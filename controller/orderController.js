const { formatResponse } = require("../response.js");
const itemsData = require("../db/db_items.json");
const usersData = require("../db/db_users.json");
const ordersData = require("../db/db_order.json");
const fs = require("fs");
const generateId = require("../helper/generateId.js");

class OrderItemController {
  static async postNewOrder(req, res) {
    let { id_user, item_name, quantity } = req.body;

    const userToken = usersData.find((i) => i.authToken);
    const users = usersData.find((i) => i.id === id_user);
    const items = itemsData.find((i) => i.name === item_name);

    let isToken = false;
    if (userToken.authToken !== null && users.id === id_user) {
      isToken = true;
    } else {
      throw new Error("The action required authentication!");
    }

    if (!items.name) {
      throw new Error("Invalid item name!");
    }

    if (!quantity || !Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("Invalid quantity");
    }

    let orderData;
    generateId().then((id) => {
      orderData = {
        id: "ORDER_" + id,
        userId: users.id,
        authToken: users.authToken,
        order: {
          id: items.id,
          name: items.name,
          quantity: quantity,
          total_price: quantity * items.price,
        },
      };

      fs.writeFileSync(
        "./db/db_order.json",
        JSON.stringify(ordersData),
        "utf-8"
      );

      try {
        return res
          .status(200)
          .json(formatResponse(orderData, `Order has been created!`));
      } catch (error) {
        let notFoundCode = 404;
        return res.status(notFoundCode).json(formatResponse(null, error));
      }
    });
  }
}

module.exports = { OrderItemController };
