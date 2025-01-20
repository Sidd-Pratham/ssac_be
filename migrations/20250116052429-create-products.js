'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      category: {
        type: Sequelize.ENUM('Engine','Suspension','Braking','Electricals','Exhaust','Body','Accessories','Other'),
        allowNull: false,
      },
      manufacturer_name:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      avg_cost_price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      selling_price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      product_mrp: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      profit: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      product_code: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      deletedAt:{
        type:Sequelize.TINYINT,
        defaultValue:0,
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};