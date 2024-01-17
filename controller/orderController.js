const { formatResponse } = require("../response.js");
const itemsData = require("../db/db_items.json");
const usersData = require("../db/db_users.json");
const ordersData = require("../db/db_order.json");
const fs = require("fs");
const generateId = require("../helper/generateId.js");
const generateDate = require("../helper/generateDate.js");

class OrderItemController {
  static async postNewOrder(req, res) {
    let id_user = req.params.id;
    let { item_name, quantity } = req.body;
    const users = usersData.find((i) => i.id === id_user);
    const items = itemsData.find((i) => i.name === item_name);

    let orderData;
    if (users.authToken === null && users.id !== id_user) {
      return res
        .status(404)
        .json(formatResponse(null, "Butuh melakukan login dahulu!"));
    }

    if (!items) {
      return res
        .status(404)
        .json(formatResponse(null, "Nama item tidak valid!"));
    }

    if (!quantity || !Number.isInteger(quantity) || quantity <= 0) {
      return res
        .status(404)
        .json(formatResponse(null, "kuantitas tidak valid"));
    }

    generateId().then((id) => {
      orderData = {
        id: "ORDER_" + id,
        userId: users.id,
        createdAt: generateDate(),
        updatedAt: null,
        itemId: items.id,
        qty: quantity,
        total_price: quantity * items.price,
        isPaid: false,
        statusOrder: "Menunggu pembayaran...",
      };

      if (items) {
        if (items.stock >= quantity) {
          items.stock -= quantity;
          items.updatedAt = generateDate();
          fs.writeFileSync(
            "./db/db_items.json",
            JSON.stringify(itemsData),
            "utf-8"
          );
        } else {
          return res
            .status(404)
            .json(formatResponse(null, "Item kehabisan stok!"));
        }
      }

      ordersData.push(orderData);
      fs.writeFileSync(
        "./db/db_order.json",
        JSON.stringify(ordersData),
        "utf-8"
      );

      for (const i in itemsData) {
        if (items.id === id_user) {
          itemsData[i].stock -= req.body.quantity;
        }
      }
      fs.writeFileSync(
        "./db/db_items.json",
        JSON.stringify(itemsData),
        "utf-8"
      );

      return res
        .status(200)
        .json(formatResponse(orderData, `Pesanan telah dibuat!`));
    });
  }

  static putUpdateStatusOrder(req, res) {
    let id_user = req.params.id;
    let { id, isPaid } = req.body;
    const users = usersData.find((i) => i.id === id_user);
    const orders = ordersData.find((i) => i.id === id);

    let orderData = {
      id: orders.id,
      userId: orders.userId,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
      itemId: orders.itemId,
      qty: orders.qty,
      total_price: orders.total_price,
      isPaid: orders.isPaid,
      statusOrder: orders.statusOrder,
    };

    if (orders.id !== id) {
      return res.json(
        formatResponse(null, "Pesanan tidak ditemukan, coba pesanan lain!")
      );
    } else {
      if (isPaid === false) {
        return res.json(formatResponse(null, "Pesanan belum dibayar!"));
      } else {
        for (const i in ordersData) {
          if (orders.id === ordersData[i].id) {
            orderData.updatedAt = generateDate();
            orderData.isPaid = true;
            orderData.statusOrder = "Pembayaran Sukses!";

            ordersData.splice(orders.id, 1);
            ordersData.push(orderData);
            fs.writeFileSync(
              "./db/db_order.json",
              JSON.stringify(ordersData),
              "utf-8"
            );
          }
          return res.json(formatResponse(orderData, "Sukses!"));
        }
      }
    }
  }
}

module.exports = { OrderItemController };
