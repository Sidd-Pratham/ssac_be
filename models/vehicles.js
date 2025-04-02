'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class vehicles extends Model {
    static associate(models) {
      vehicles.belongsToMany(models.products, {
        through: 'product_vehicle_associations',
        foreignKey: 'vehicle_id', // Column in PRODUCT_VEHICLE_ASSOCIATION referencing Vehicle's id
        otherKey: 'product_id',  // Column in PRODUCT_VEHICLE_ASSOCIATION referencing Product's id
    });
    }
  }
  vehicles.init({
    name: DataTypes.STRING,
    brand_name:DataTypes.STRING,
    deletedAt:DataTypes.TINYINT
  }, {
    sequelize,
    modelName: 'vehicles',
  });
  return vehicles;
};