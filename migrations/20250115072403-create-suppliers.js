'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('suppliers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      contact_number: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      sales_person_name: {
        type: Sequelize.STRING
      },
      sales_person_contact_number: {
        type: Sequelize.STRING
      },
      bank_account_number: {
        type: Sequelize.STRING
      },
      bank_branch_name: {
        type: Sequelize.STRING
      },
      bank_branch_ifsc: {
        type: Sequelize.STRING
      },
      supplier_gst_number: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('suppliers');
  }
};