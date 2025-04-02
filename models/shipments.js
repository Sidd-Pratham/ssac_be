'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class shipments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      shipments.belongsTo(models.suppliers,{
        foreignKey:"supplier_id",
        targetKey:"id",
        as:"supplierDetails"
      });
      shipments.hasMany(models.purchase_orders, {
        foreignKey: 'shipment_id',
        as: 'purchaseOrders',
      });
    }
  }
  shipments.init({
    supplier_id :
    {
      type:DataTypes.INTEGER,
      references:{
        model:"suppliers",
        key:"id"
      }
    },
    total_value:{type:DataTypes.INTEGER,allowNull:false},
    status:{type:DataTypes.ENUM('Ordered','Received','Paid'),allowNull:false},
    payment_details:DataTypes.STRING,
    tentative_payment_date:DataTypes.DATEONLY,
    payment_date:DataTypes.DATEONLY,
    firm_associated:DataTypes.ENUM('SSAC','SSA'),
    deletedAt:{type:DataTypes.TINYINT,allowNull:false,defaultValue:0},
  }, {
    sequelize,
    modelName: 'shipments',
  });
  return shipments;
};