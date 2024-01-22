const express = require("express");
const itemRouter = express.Router();
const { ItemController } = require("../controller/itemController.js");

const methodNotAllowed = (req, res, next) => {
  try {
    throw new Error("Method not supported!");
  } catch (error) {
    res.status(405).json(error.message);
  }
};

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
