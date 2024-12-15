'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('book', [
      {
        ISBN: '9783161484200',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        createdAt: new Date(),
        updatedAt: new Date(),
        quantity:100
      },
      {
        ISBN: '9780747532743',
        title: 'Harry Potter and the Philosopher\'s Stone',
        author: 'J.K. Rowling',
        createdAt: new Date(),
        updatedAt: new Date(),
        quantity:100
      },
      {
        ISBN: '9780451524935',
        title: '1984',
        author: 'George Orwell',
        createdAt: new Date(),
        updatedAt: new Date(),
        quantity:100

      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('book', null, {});
  }
};
