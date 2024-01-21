const { formatResponse } = require("../response.js");
const fs = require("fs");
const generateDate = require("../helper/generateDate.js");
const { Order, Item } = require("../models");
const item = require("../models/item.js");

class OrderItemController {
  static async getAllOrder(_, res) {
    let message = "Success";
    let statusCode = 201;

    try {
      const orders = await Order.findAll({});
      if (orders.length === 0) {
        throw new Error(error);
      } else {
        return res.status(statusCode).json({ orders, message });
      }
    } catch (error) {
      statusCode = 404;
      return res.status(statusCode).json({ error: "Database is empty!" });
    }
  }

  static async getOrderById(req, res) {
    const id = +req.params.id;
    let statusCode = 200;
    let message = "Success";

    try {
      const orderById = await Order.findByPk(id);
      if (!orderById) {
        throw new Error(error);
      } else {
        return res.status(statusCode).json({ orderById, message });
      }
    } catch (error) {
      statusCode = 404;
      return res
        .status(statusCode)
        .json({ error: `Order with Id ${id} not found!` });
    }
  }

  static async postNewOrder(req, res) {
    // fix this first!
    let { userId, itemName, quantity } = req.body;
    let statusCode = 201;
    let message = "Success";
    let statusMessage = "Waiting for payment...";

    try {
      const searchItem = await Item.findOne({ where: { name: itemName } });
      const orderCreate = await Order.create({
        userId: userId,
        itemId: searchItem.dataValues.id,
        qty: quantity,
        totalPrice: searchItem.dataValues.price * quantity,
        status: "Not Paid",
      });

      if (searchItem.dataValues.stock <= 0) {
        throw new Error("Item out of stock!");
      }

      await Item.update(
        {
          stock: searchItem.dataValues.stock - quantity,
        },
        { where: { name: itemName } }
      );
      return res
        .status(statusCode)
        .json({ orderCreate, message, statusMessage });
    } catch (error) {
      statusCode = 400;
      message = "Something went wrong!";
      return res.status(statusCode).json(error.message);
    }
  }

  static async putUpdateStatusOrder(req, res) {
    const id = +req.params.id;
    const status = req.body.status;
    let statusCode = 201;
    let message = "Success";
    let statusMessage = "Payment success, your order will arrive soon";

    try {
      const searchOrder = await Order.findOne({ where: { id: id } });
      if (searchOrder.dataValues.id !== id) {
        throw new Error("Order missing, try another order!");
      }

      if (status !== "Paid") {
        throw new Error("Pay for your order as soon as possible!");
      } else if (!status) {
        throw new Error("Status unknown, try again!");
      }

      const updateOrder = await Order.update(
        {
          status: status,
        },
        { where: { id: id } }
      );

      return res
        .status(statusCode)
        .json({ searchOrder, message, statusMessage });
    } catch (error) {
      console.log(error);
      statusCode = 400;
      message = "Something went wrong!";
      return res.status(statusCode).json(error.message);
    }

    //   if (orders === -1) {
    //     return res.json(
    //       formatResponse(null, "Pesanan tidak ditemukan, coba pesanan lain!")
    //     );
    //   }

    //   let data = {
    //     id: orders.id,
    //     userId: orders.userId,
    //     createdAt: orders.createdAt,
    //     updatedAt: orders.updatedAt,
    //     itemId: orders.itemId,
    //     qty: orders.qty,
    //     total_price: orders.total_price,
    //     isPaid: orders.isPaid,
    //     statusOrder: orders.statusOrder,
    //   };

    //   data.updatedAt = generateDate();
    //   data.isPaid = isPaid;
    //   data.statusOrder = "Pembayaran berhasil";

    //   let orderTarget = ordersData.findIndex((i) => i.id === orderId);
    //   ordersData.splice(orderTarget, 1, data);

    //   fs.writeFileSync("./db/db_order.json", JSON.stringify(ordersData), "utf-8");
    //   res.status(200).json(formatResponse(data, "Sukses!"));
  }
}

module.exports = { OrderItemController };
