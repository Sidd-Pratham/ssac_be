'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('product_model_associations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:"products",
          key:"id"
        }
      },
      vehicle_model_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:"vehicles_models",
          key:"id"
        }
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('product_model_associations');
  }
};
