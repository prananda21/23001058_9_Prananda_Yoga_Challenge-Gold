const express = require("express");
const app = express();
const orderRouter = express.Router();
const { OrderItemController } = require("../controller/orderController.js");

const methodNotAllowed = (req, res, next) => {
  try {
    throw new Error("Method not supported!");
  } catch (error) {
    res.status(405).json(error.message);
  }
};

orderRouter
  .route("/")
  .get(OrderItemController.getAllOrder)
  .post(OrderItemController.postNewOrder)
  .all(methodNotAllowed);

orderRouter
  .route("/:id")
  .get(OrderItemController.getOrderById)
  .put(OrderItemController.putUpdateStatusOrder)
  .all(methodNotAllowed);

module.exports = orderRouter;
