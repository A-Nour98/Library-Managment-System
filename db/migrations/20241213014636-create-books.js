'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create the 'book' table with specified columns
    await queryInterface.createTable('book', {
      ISBN: {
        allowNull: false, // ISBN cannot be null
        primaryKey: true, // ISBN will be the primary key
        type: Sequelize.STRING // Data type for ISBN is string
      },
      title: {
        type: Sequelize.STRING // Data type for title is string
      },
      author: {
        type: Sequelize.STRING // Data type for author is string
      },
      quantity: {
        type: Sequelize.INTEGER // Data type for quantity is integer
      },
      shelf_location: {
        type: Sequelize.STRING // Data type for shelf location is string
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

    // Add an index on the 'title' column for efficient querying
    await queryInterface.addIndex('book', ['title'], {
      fields: ['title'], // Specify the field for the index
    });

    // Add an index on the 'author' column for efficient querying
    await queryInterface.addIndex('book', ['author'], {
      fields: ['author'], // Specify the field for the index
    });
  },
  
  async down(queryInterface, Sequelize) {
    // Drop the 'book' table if the migration is rolled back
    await queryInterface.dropTable('book');
  }
};
