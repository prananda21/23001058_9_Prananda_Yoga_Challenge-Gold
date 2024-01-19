const express = require("express");
const app = express();
const orderRouter = express.Router();
const { OrderItemController } = require("../controller/orderController.js");

const methodNotAllowed = (req, res, next) =>
  res.status(405).json({ error: "Method not supported!" });

orderRouter
  .route("/")
  .get(OrderItemController.getAllOrder)
  .post(OrderItemController.postNewOrder)
  .all(methodNotAllowed);

orderRouter
  .route("/:id")
  .put(OrderItemController.putUpdateStatusOrder)
  .all(methodNotAllowed);

module.exports = orderRouter;
