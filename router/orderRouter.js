const express = require("express");
const orderRouter = express.Router();
const { OrderItemController } = require("../controller/orderController.js");

orderRouter
  .route("/:id")
  .post(OrderItemController.postNewOrder)
  .put(OrderItemController);

module.exports = orderRouter;
