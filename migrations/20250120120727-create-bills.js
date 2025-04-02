'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bills', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      consumer_contact: {
        type: Sequelize.STRING
      },
      total_order_value: {
        type: Sequelize.INTEGER
      },
      total_received_payment: {
        type: Sequelize.INTEGER
      },
      payment_method: {
        type: Sequelize.ENUM('Cash', 'Card','UPI')
      },
      total_profit: {
        type: Sequelize.INTEGER
      },
      payment_status: {
        type: Sequelize.ENUM('Paid', 'Pending') // ENUM definition
      },
      billing_date: {
        type: Sequelize.DATE
      },
      deletedAt:{
        type: Sequelize.TINYINT,
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
    await queryInterface.dropTable('bills');
  }
};