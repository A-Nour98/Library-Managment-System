'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('borrower', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING, 
        unique: true 
      },
      name: {
        type: Sequelize.STRING
      },
      registered_date: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
      await queryInterface.addIndex('borrower', ['name'], {
        unique: false,          // Optional: Set to true if the index should enforce uniqueness
        fields: ['name'],      // Column(s) to index
      });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('borrower');
  }
};