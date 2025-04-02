'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("vehicles","deleteAt",{
      type:Sequelize.TINYINT,
      defaultValue:0,
      allowNull:false
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("vehicles","deleteAt",{
      type:Sequelize.TINYINT,
      defaultValue:0,
      allowNull:false
    })
  }
};
