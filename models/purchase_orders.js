'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class purchase_orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      purchase_orders.belongsTo(models.bills,{
        foreignKey:"shipment_id",
        targetKey:"id",
        as:"billDetails"
      });
      purchase_orders.belongsTo(models.products,{
        foreignKey:"product_id",
        targetKey:"id",
        as:"productDetails"
      });
    }
  }
  purchase_orders.init({
    shipment_id:{
      type:DataTypes.INTEGER,
      references:{
        model:"shipments",
        key:"id"
      }
    },
    product_id:{
      type:DataTypes.INTEGER,
      references:{
        model:"products",
        key:"id"
      }
    },
    product_quantity: DataTypes.INTEGER,
    unit_price:DataTypes.INTEGER,
    total_price:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'purchase_orders',
  });
  return purchase_orders;
};