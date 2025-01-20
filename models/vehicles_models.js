'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class vehicles_models extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    vehicles_models.belongsTo(models.vehicles,{
      foreignKey:"vehicle_id",
      targetKey:"id",
      as:"vehicleDetails"
    });
    vehicles_models.belongsToMany(models.products, {
      through: 'product_model_associations',
      foreignKey: 'vehicle_model_id', // Column in PRODUCT_VEHICLE_ASSOCIATION referencing Vehicle's id
      otherKey: 'product_id',  // Column in PRODUCT_VEHICLE_ASSOCIATION referencing Product's id
  });
    }
  }
  vehicles_models.init({
    name: DataTypes.STRING,
    year:DataTypes.STRING,
    vehicle_id:
    {
      type:DataTypes.INTEGER,
      references:{
        model:"vehicles",
        key:"id"
      }
    },
    deletedAt:DataTypes.TINYINT
  }, {
    sequelize,
    tableName:"vehicles_models",
    modelName:'vehicle_models',
  });
  return vehicles_models;
};