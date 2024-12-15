'use strict';
const { Model,Sequelize } = require('sequelize');
const sequelize = require('../../config/database');
module.exports = sequelize.define('book',{
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
},
{
  freezeTableName:true,
  modelName: 'book',
  paranoid: true,
});

