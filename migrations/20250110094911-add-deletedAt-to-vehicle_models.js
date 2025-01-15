'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("vehicles_models","deletedAt",{
      type:Sequelize.TINYINT,
      defaultValue:0,
      allowNull:false,
      after:"vehicle_id"
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn("vehicles_models","deletedAt",{
      type:Sequelize.TINYINT,
      defaultValue:0,
      allowNull:false,
      after:"vehicle_id"
    })
  }
};
