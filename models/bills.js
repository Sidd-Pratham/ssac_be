'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bills extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      bills.hasMany(models.sale_orders, {
        foreignKey: 'bill_id',
        as: 'saleOrders',
      });
    }
  }
  bills.init({
    consumer_contact: DataTypes.STRING,
    total_order_value: DataTypes.INTEGER,
    total_received_payment: DataTypes.INTEGER,
    payment_method: DataTypes.ENUM('Cash', 'Card','UPI'),
    total_profit: DataTypes.INTEGER,
    payment_status: DataTypes.ENUM('Paid', 'Pending'),
    billing_date: DataTypes.DATE,
    deletedAt:DataTypes.TINYINT  
  }, {
    sequelize,
    modelName: 'bills',
  });
  return bills;
};