const express = require("express");
const itemRouter = express.Router();
const { ItemController } = require("../controller/itemController.js");

itemRouter
  .route("/")
  .get(ItemController.getAllItem)
  .post(ItemController.postNewItem);

itemRouter.route("/:id").get(ItemController.getItemById);

module.exports = itemRouter;
