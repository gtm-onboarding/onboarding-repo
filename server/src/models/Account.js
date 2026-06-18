const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Account = sequelize.define('Account', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  accountNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  balance: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  accountType: {
    type: DataTypes.ENUM('checking', 'savings', 'investment'),
    defaultValue: 'checking'
  },
  status: {
    type: DataTypes.ENUM('active', 'suspended', 'closed'),
    defaultValue: 'active'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'accounts',
  timestamps: true
});

module.exports = Account;
