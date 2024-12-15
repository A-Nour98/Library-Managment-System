'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('book', {
      ISBN: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      author: {
        type: Sequelize.STRING
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      shelf_location: {
        type: Sequelize.STRING
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
    })
      await queryInterface.addIndex('book', ['title'], {
        fields: ['title'],      
      });
      queryInterface.addIndex('book', ['author'], {
        fields: ['author'],      
      });
    
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('book');
  }
};

