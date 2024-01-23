const { User, Order, Item } = require("../models");

//Note: Attributes disini sepertinya digunakan berkali kali di query dibawah juga. Maka bisa dijadikan variable saja seperti ini. Note ini berlaku untuk controller lain
// const attributes = [
//   "id",
//   "firstName",
//   "lastName",
//   "email",
//   "phoneNumber",
//   "address",
//   "authToken",
//   "createdAt",
//   "updatedAt",
// ]

class OrderItemController {
  static async getAllOrder(_, res) {
    let message = "Success";
    let statusCode = 201;

    try {
      const orders = await Order.findAll({
        include: [
          {
            model: User,
            attributes: [
              "id",
              "firstName",
              "lastName",
              "email",
              "phoneNumber",
              "address",
              "authToken",
              "createdAt",
              "updatedAt",
            ],
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
            attributes: [
              "id",
              "firstName",
              "lastName",
              "email",
              "phoneNumber",
              "address",
              "authToken",
              "createdAt",
              "updatedAt",
            ],
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
    // fix this first!
    let { userId, itemName, quantity } = req.body;
    let statusCode = 201;
    let message = "Success";
    let statusMessage = "Waiting for payment...";

    try {
      //Note: Disini seharusnya tidak perlu lagi imelakukan find item karena table order sudah memiliki relasi dengan table item. Jika item tidak ada di table, maka order pun tidak akan bisa dicreate
      const searchItem = await Item.findOne({ where: { name: itemName } });
      const isLogin = await User.findOne({ where: { id: userId } });
      const orderCreate = await Order.create({
        userId: userId,
        itemId: searchItem.dataValues.id,
        qty: quantity,
        totalPrice: searchItem.dataValues.price * quantity,
        status: "Not Paid",
      });

      //Note: Validasi ini harusnya dilakukan sebelum Order.create dipanggil
      if (!isLogin?.dataValues?.authToken) {
        throw new Error("Need login action!");
      }

      //Note: Validasi ini harusnya dilakukan sebelum Order.create dipanggil
      if (searchItem.dataValues.stock <= 0) {
        throw new Error("Item out of stock!");
      }

      //Note: Karena ada proses Order.create dan pengurangan stock, maka proses disini harusnya menggunakan transaction. Karena jika update disini gagal sedangkan order sudah dibuat, maka akan ada kesalahan data
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
            attributes: [
              "id",
              "firstName",
              "lastName",
              "email",
              "phoneNumber",
              "address",
              "authToken",
              "createdAt",
              "updatedAt",
            ],
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
              attributes: [
                "id",
                "firstName",
                "lastName",
                "email",
                "phoneNumber",
                "address",
                "authToken",
                "createdAt",
                "updatedAt",
              ],
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
      //Note: Hapus console.lognya
      console.log(error);
      statusCode = 400;
      message = "Something went wrong!";
      return res.status(statusCode).json(error.message);
    }
  }
}

module.exports = { OrderItemController };
