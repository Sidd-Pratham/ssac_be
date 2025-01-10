'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class vehicles extends Model {
    static associate(models) {
      // define association here
    }
  }
  vehicles.init({
    name: DataTypes.STRING,
    brand_name:DataTypes.STRING,
    deleteAt:DataTypes.TINYINT
  }, {
    sequelize,
    modelName: 'vehicles',
  });
  return vehicles;
};