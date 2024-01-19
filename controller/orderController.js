const { formatResponse } = require("../response.js");
const itemsData = require("../db/db_items.json");
const usersData = require("../db/db_users.json");
const ordersData = require("../db/db_order.json");
const fs = require("fs");
const generateDate = require("../helper/generateDate.js");
const { ConnectionTimedOutError } = require("sequelize");

class OrderItemController {
  static getAllOrder(_, res) {
    const filterData = ordersData.map((i) => ({
      id: i.id,
      userId: i.userId,
      createdAt: i.createdAt,
      updatedAt: i.updatedAt,
      itemId: i.itemId,
      qty: i.qty,
      total_price: i.total_price,
      isPaid: i.isPaid,
      statusOrder: i.statusOrder,
    }));
    return res.status(200).json(formatResponse(filterData));
  }

  static async postNewOrder(req, res) {
    let { idUser, itemName, quantity } = req.body;
    const users = usersData.find((i) => i.id === idUser);
    const items = itemsData.find((i) => i.name === itemName);

    let orderData;
    if (users?.authToken === null && users.id !== idUser) {
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
        .json(formatResponse(null, "Kuantitas tidak valid"));
    }

    orderData = {
      // yang ini ya bang
      id: ordersData.length + 1,
      userId: users.id,
      createdAt: generateDate(),
      updatedAt: generateDate(),
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
    fs.writeFileSync("./db/db_order.json", JSON.stringify(ordersData), "utf-8");

    for (const i in itemsData) {
      if (items.id === idUser) {
        itemsData[i].stock -= req.body.quantity;
      }
    }
    fs.writeFileSync("./db/db_items.json", JSON.stringify(itemsData), "utf-8");

    return res
      .status(200)
      .json(formatResponse(orderData, `Pesanan telah dibuat!`));
  }

  static putUpdateStatusOrder(req, res) {
    const orderId = +req.params.id;
    const isPaid = req.body.isPaid;
    const orders = ordersData.find((i) => i.id === +orderId);

    if (orders === -1) {
      return res.json(
        formatResponse(null, "Pesanan tidak ditemukan, coba pesanan lain!")
      );
    }

    let data = {
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

    data.updatedAt = generateDate();
    data.isPaid = isPaid;
    data.statusOrder = "Pembayaran berhasil";

    let orderTarget = ordersData.findIndex((i) => i.id === orderId);
    ordersData.splice(orderTarget, 1, data);

    fs.writeFileSync("./db/db_order.json", JSON.stringify(ordersData), "utf-8");
    res.status(200).json(formatResponse(data, "Sukses!"));
  }
}

module.exports = { OrderItemController };
