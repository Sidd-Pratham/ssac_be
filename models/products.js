'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    products.belongsToMany(models.vehicles, {
        through: 'product_vehicle_associations',
        foreignKey: 'product_id', // Column in PRODUCT_VEHICLE_ASSOCIATION referencing Product's id
        otherKey: 'vehicle_id',  // Column in PRODUCT_VEHICLE_ASSOCIATION referencing Vehicle's id
    });
    products.belongsToMany(models.vehicle_models, {
      through: 'product_model_associations',
      foreignKey: 'product_id', // Column in PRODUCT_VEHICLE_ASSOCIATION referencing Product's id
      otherKey: 'vehicle_model_id',  // Column in PRODUCT_VEHICLE_ASSOCIATION referencing Vehicle's id
    });
    }
  }
  products.init({
    name: {type:DataTypes.STRING,allowNull:false},
    product_code: {type:DataTypes.STRING,allowNull:false,unique:true},
    quantity:{type:DataTypes.INTEGER,defaultValue:0},
    category:{type:DataTypes.ENUM('Engine','Suspension','Braking','Electricals','Exhaust','Body','Accessories','Other'),allowNull:false,defaultValue:'others'},
    manufacturer_name:{type:DataTypes.STRING,allowNull:false},
    avg_cost_price:{type:DataTypes.INTEGER,allowNull:false},
    selling_price:{type:DataTypes.INTEGER,allowNull:false},
    product_mrp:{type:DataTypes.INTEGER,allowNull:false},
    description:{type:DataTypes.TEXT},
    profit:{type:DataTypes.INTEGER,allowNull:false},
    deletedAt:{type:DataTypes.TINYINT,allowNull:false,defaultValue:0}
  }, {
    sequelize,
    modelName: 'products',
  });
  return products;
};