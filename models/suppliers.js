'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class suppliers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  suppliers.init({
    name: DataTypes.STRING,
    contact_number: DataTypes.STRING,
    address: DataTypes.STRING,
    sales_person_name: DataTypes.STRING,
    sales_person_contact_number: DataTypes.STRING,
    bank_account_number: DataTypes.STRING,
    bank_branch_name: DataTypes.STRING,
    bank_branch_ifsc: DataTypes.STRING,
    supplier_gst_number: DataTypes.STRING,
    deletedAt:DataTypes.TINYINT
  }, {
    sequelize,
    modelName: 'suppliers',
  });
  return suppliers;
};