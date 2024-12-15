'use strict';
const {
  Model,Sequelize
} = require('sequelize');
const sequelize = require('../../config/database');

module.exports = sequelize.define('checkout',{
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  ISBN: {
    type: Sequelize.STRING
  },
  borrower_id: {
    type: Sequelize.INTEGER
  },
  due_date: {
    type: Sequelize.DATE
  },
  returned: {
    type: Sequelize.BOOLEAN
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  deletedAt:{
    type: Sequelize.DATE
  }
},
{freezeTableName:true,
modelName: 'checkout',
paranoid: true,

});

