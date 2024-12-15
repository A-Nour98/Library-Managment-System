'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create the 'checkout' table with specified columns
    await queryInterface.createTable('checkout', {
      id: {
        allowNull: false, // id cannot be null
        autoIncrement: true, // id will automatically increment
        primaryKey: true, // id will be the primary key
        type: Sequelize.INTEGER // Data type for id is integer
      },
      ISBN: {
        type: Sequelize.STRING // Data type for ISBN is string
      },
      borrower_id: {
        type: Sequelize.INTEGER // Data type for borrower_id is integer
      },
      due_date: {
        type: Sequelize.DATE // Data type for due_date is date
      },
      returned: {
        type: Sequelize.BOOLEAN // Data type for returned is boolean
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
  },

  async down(queryInterface, Sequelize) {
    // Drop the 'checkout' table if the migration is rolled back
    await queryInterface.dropTable('checkout');
  }
};
