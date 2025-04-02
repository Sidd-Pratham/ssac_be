'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('shipments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      supplier_id:{
        type:Sequelize.INTEGER,
        references:{
          model:"suppliers",
          key:"id"
        }
      },
      total_value:{
        type:Sequelize.INTEGER
      },
      status:{
        type:Sequelize.ENUM('Ordered','Received','Paid'),
        allowNull:false
      },
      tentative_payment_date:{type:Sequelize.DATEONLY},
      payment_date:{type:Sequelize.DATEONLY},
      firm_associated:{type:Sequelize.ENUM('SSAC','SSA')},
      payment_details: {
        type: Sequelize.STRING
      },
      deletedAt:{type:Sequelize.TINYINT,allowNull:false,defaultValue:0},
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
    await queryInterface.dropTable('shipments');
  }
};