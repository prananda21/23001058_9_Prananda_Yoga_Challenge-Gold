const { formatResponse } = require("../response.js");
const itemsData = require("../db/db_items.json");
const usersData = require("../db/db_users.json");
const ordersData = require("../db/db_order.json");
const fs = require("fs");

class OrderItemController {
  static postNewOrder(req, res) {
    let { itemName, quantity } = req.body;
    const user = usersData.find((i) => i.authToken);

    // check if user already login or not
    let isToken = false;
    if (user.authToken) {
      isToken = true;
    } else {
      return res.status(401).json("The action required authentication!");
    }

    let orderData = {
      id: user.id,
      name: user.name,
      email: user.email,
      authToken: user.authToken,
      order: {},
    };

    function findOrderItem(itemName, quantity) {
      fs.readFile("../challenge-gold/db/db_items.json", (err, data) => {
        if (err) {
          console.log("Error reading db_items.json", err);
        }

        try {
          const findItemName = itemsData.find((i) => i.name === itemName);
          const findQuantity = itemsData.find((i) => i.quantity === +quantity);

          let notFoundCode = 400;
          if (
            !findItemName ||
            typeof findItemName !== "string" ||
            findItemName.trim() === ""
          ) {
            return res
              .status(notFoundCode)
              .json({ error: "Invalid item name" });
          }

          if (
            !findQuantity ||
            !Number.isInteger(findQuantity) ||
            findQuantity <= 0
          ) {
            return res.status(notFoundCode).json({ error: "Invalid quantity" });
          }
        } catch (error) {
          console.log("Error parsing db_items.json");
        }
      });
    }

    async function createOrder(itemName, quantity) {
      const findItemName = itemsData.find((i) => i.name === itemName);
      const itemPrice = req.body.quantity * findItemName.price;

      orderData = {
        id: user.id, // generate new id format for order please
        email: user.email,
        authToken: user.authToken,
        order: {
          id: findItemName.id,
          name: itemName,
          quantity: quantity,
          price: itemPrice,
        },
      };

      ordersData.push(orderData);
      fs.writeFileSync(
        "./db/db_order.json",
        JSON.stringify(ordersData),
        "utf-8"
      );
      console.log("Order has been generated");
      console.log(orderData);

      return res.status(200).json(formatResponse(orderData));
    }

    function updateOrderDatabase(itemName, quantity) {
      const findItemName = itemsData.find((i) => i.name === itemName);
      const findQuantity = itemsData.find((i) => i.quantity === +quantity);
    }

    findOrderItem(itemName, quantity);
    createOrder(itemName, quantity)
      .then((done) => {
        if (done) {
          console.log("Order successfully generated");
        }
      })
      .catch((err) => {
        console.log("Error generate the order", err);
      });
  }
}

module.exports = { OrderItemController };
