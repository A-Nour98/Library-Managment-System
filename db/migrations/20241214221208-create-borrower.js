'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create the 'borrower' table with specified columns
    await queryInterface.createTable('borrower', {
      id: {
        allowNull: false, // id cannot be null
        autoIncrement: true, // id will automatically increment
        primaryKey: true, // id will be the primary key
        type: Sequelize.INTEGER // Data type for id is integer
      },
      email: {
        type: Sequelize.STRING, // Data type for email is string
        unique: true // Email must be unique
      },
      name: {
        type: Sequelize.STRING // Data type for name is string
      },
      registered_date: {
        type: Sequelize.DATE // Data type for registered_date is date
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE // Data type for createdAt is date
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE // Data type for updatedAt is date
      },
      deletedAt: {
        type: Sequelize.DATE // Data type for deletedAt is date
      }
    });

    // Add an index on the 'name' column for efficient querying
    await queryInterface.addIndex('borrower', ['name'], {
      unique: false, // Optional: Set to true if the index should enforce uniqueness
      fields: ['name'], // Column(s) to index
    });
  },
  
  async down(queryInterface, Sequelize) {
    // Drop the 'borrower' table if the migration is rolled back
    await queryInterface.dropTable('borrower');
  }
};
