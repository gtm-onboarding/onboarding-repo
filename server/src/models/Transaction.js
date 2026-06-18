const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  accountId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'accounts',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('credit', 'debit', 'transfer'),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'completed'
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  processedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'transactions',
  timestamps: true
});

module.exports = Transaction;
