'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("suppliers","deletedAt",{
      type:Sequelize.TINYINT,
      defaultValue:0,
      allowNull:false,
      after:"supplier_gst_number"
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("suppliers","deletedAt",{
      type:Sequelize.TINYINT,
      defaultValue:0,
      allowNull:false,
      after:"supplier_gst_number"
    })
  }
};
