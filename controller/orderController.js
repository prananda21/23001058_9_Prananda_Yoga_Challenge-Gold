const { User, Order, Item } = require("../models");
const attributes = [
  "id",
  "firstName",
  "lastName",
  "email",
  "phoneNumber",
  "address",
  "authToken",
  "createdAt",
  "updatedAt",
];

class OrderItemController {
  static async getAllOrder(_, res) {
    let message = "Success";
    let statusCode = 201;

    try {
      const orders = await Order.findAll({
        include: [
          {
            model: User,
            attributes: attributes,
          },
          { model: Item },
        ],
      });

      if (orders.length === 0) {
        throw new Error("Database is empty!");
      } else {
        return res.status(statusCode).json({ orders, message });
      }
    } catch (error) {
      statusCode = 404;
      return res.status(statusCode).json(error.message);
    }
  }

  static async getOrderById(req, res) {
    const id = +req.params.id;
    let statusCode = 200;
    let message = "Success";

    try {
      const orderById = await Order.findOne({
        where: { id: id },
        include: [
          {
            model: User,
            attributes: attributes,
          },
          { model: Item },
        ],
      });

      if (!orderById) {
        throw new Error(`Order with Id ${id} not found!`);
      } else {
        return res.status(statusCode).json({ orderById, message });
      }
    } catch (error) {
      statusCode = 404;
      return res.status(statusCode).json(error.message);
    }
  }

  static async postNewOrder(req, res) {
    let { userId, itemName, quantity } = req.body;
    let statusCode = 201;
    let message = "Success";
    let statusMessage = "Waiting for payment...";

    try {
      const searchItem = await Item.findOne({ where: { name: itemName } });
      const isLogin = await User.findOne({ where: { id: userId } });

      if (!isLogin?.dataValues?.authToken) {
        throw new Error("Need login action!");
      }

      if (searchItem.dataValues.stock <= 0) {
        throw new Error("Item out of stock!");
      }

      const orderCreate = await Order.create({
        userId: userId,
        itemId: searchItem.dataValues.id,
        qty: quantity,
        totalPrice: searchItem.dataValues.price * quantity,
        status: "Not Paid",
      });

      await Item.update(
        {
          stock: searchItem.dataValues.stock - quantity,
        },
        { where: { name: itemName } }
      );

      const data = await Order.findOne({
        where: {
          userId: userId,
          itemId: searchItem.dataValues.id,
          qty: quantity,
        },
        include: [
          {
            model: User,
            attributes: attributes,
          },
          { model: Item },
        ],
      });

      return res.status(statusCode).json({ data, message, statusMessage });
    } catch (error) {
      statusCode = 400;
      console.log(error);
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
      const findStatus = await Order.findOne({
        where: { id: id },
      });
      if (status === "Paid" && findStatus.dataValues.status !== status) {
        const updateOrder = await Order.update(
          {
            status: status,
          },
          { where: { id: id } }
        );

        const data = await Order.findOne({
          where: { id: id },
          include: [
            {
              model: User,
              attributes: attributes,
            },
            { model: Item },
          ],
        });
        if (data.dataValues.id !== id) {
          throw new Error("Order missing, try another order!");
        }

        return res.status(statusCode).json({ data, message, statusMessage });
      } else if (
        status === "Not Paid" &&
        findStatus.dataValues.status === status
      ) {
        throw new Error("Pay for your order as soon as possible!");
      } else {
        throw new Error("Status unknown, try again!");
      }
    } catch (error) {
      console.log(error);
      statusCode = 400;
      message = "Something went wrong!";
      return res.status(statusCode).json(error.message);
    }
  }
}

module.exports = { OrderItemController };
