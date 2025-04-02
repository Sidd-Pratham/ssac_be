'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sale_orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      sale_orders.belongsTo(models.bills,{
        foreignKey:"bill_id",
        targetKey:"id",
        as:"billDetails"
      });
      sale_orders.belongsTo(models.products,{
        foreignKey:"product_id",
        targetKey:"id",
        as:"productDetails"
      });
    }
  }
  sale_orders.init({
    bill_id:{
      type:DataTypes.INTEGER,
      references:{
        model:"bills",
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
    total_price:DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'sale_orders',
  });
  return sale_orders;
};