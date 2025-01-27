'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('purchase_orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      shipment_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:"shipments",
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
    await queryInterface.dropTable('purchase_orders');
  }
};