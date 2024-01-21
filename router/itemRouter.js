const express = require("express");
const itemRouter = express.Router();
const { ItemController } = require("../controller/itemController.js");

const methodNotAllowed = (req, res, next) =>
  res.status(405).json({ error: "Method not supported!" });

itemRouter
  .route("/")
  .get(ItemController.getAllItem)
  .post(ItemController.postNewItem)
  .all(methodNotAllowed);

itemRouter
  .route("/:id")
  .get(ItemController.getItemById)
  .put(ItemController.updateQtyItem)
  .all(methodNotAllowed);

module.exports = itemRouter;
