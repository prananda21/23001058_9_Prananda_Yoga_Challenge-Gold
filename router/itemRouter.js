const express = require("express");
const itemRouter = express.Router();
const { itemController } = require("../controller/itemController.js");

itemRouter
  .route("/")
  .get(itemController.getAllItem)
  .post(itemController.postNewItem);

itemRouter.route("/:id").get(itemController.getItemById);

module.exports = itemRouter;
