const sequelize = require('../db');
const { DataTypes } = require('sequelize');


const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },    
  registrationDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  lastLoginDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'blocked'),
    allowNull: false,
    defaultValue: 'active'
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'USER'
  },
});

module.exports = { User };