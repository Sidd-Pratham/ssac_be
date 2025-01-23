'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sale_orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bill_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:"bills",
          key:"id"
        }
      },
      product_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:"products",
          key:"id"
        }
      },
      product_quantity: {
        type: Sequelize.INTEGER
      },
      unit_price:{
        type: Sequelize.INTEGER
      },
      total_price:{
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('sale_orders');
  }
};