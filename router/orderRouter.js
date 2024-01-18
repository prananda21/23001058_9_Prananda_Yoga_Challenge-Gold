const express = require("express");
const orderRouter = express.Router();
const { OrderItemController } = require("../controller/orderController.js");

orderRouter.route("/").get(OrderItemController.getAllOrder);

orderRouter
  .route("/:id")
  .post(OrderItemController.postNewOrder)
  .put(OrderItemController.putUpdateStatusOrder);

module.exports = orderRouter;
