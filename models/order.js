"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.hasMany(models.Item, {
        foreignKey: "id",
        sourceKey: "itemId",
      });
      Order.hasMany(models.User, {
        foreignKey: "id",
        sourceKey: "userId",
      });
    }
  }
  Order.init(
    {
      userId: DataTypes.INTEGER,
      itemId: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
      totalPrice: DataTypes.NUMERIC,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "Orders",
    }
  );
  return Order;
};
