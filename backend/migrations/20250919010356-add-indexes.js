'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addIndex('Users', ['id'], {
      unique: true,
      name: 'users_id_idx'
    });

    await queryInterface.addIndex('Posts', ['id'], {
      unique: true,
      name: 'posts_id_idx'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('Users', 'users_id_idx');
    await queryInterface.removeIndex('Posts', 'posts_id_idx');

  }
};
