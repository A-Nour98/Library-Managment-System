'use strict';
const {
  Model,Sequelize
} = require('sequelize');
const sequelize = require('../../config/database');

module.exports = sequelize.define('borrower',{
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
},
  {freezeTableName:true,
  modelName: 'borrower',
  paranoid: true
});

