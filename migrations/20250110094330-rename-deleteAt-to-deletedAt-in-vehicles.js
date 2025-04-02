'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('vehicles', 'deleteAt', 'deletedAt');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('vehicles', 'deletedAt', 'deleteAt');
  }
};
