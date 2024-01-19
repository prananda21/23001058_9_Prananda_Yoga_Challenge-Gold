const express = require("express");
const itemRouter = express.Router();
const itemsData = require("../db/db_items.json");
const { ItemController } = require("../controller/itemController.js");

const methodNotAllowed = (req, res, next) =>
  res.status(405).json({ error: "Method not supported!" });

// const internalServerError = (err, req, res, next) => {
//   console.log(err);
//   res.status(500).json({ error: err.message });
// };

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
