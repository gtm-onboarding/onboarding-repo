const sequelize = require('../config/database');
const Account = require('./Account');
const Transaction = require('./Transaction');

// Define associations
Account.hasMany(Transaction, { foreignKey: 'accountId', as: 'transactions' });
Transaction.belongsTo(Account, { foreignKey: 'accountId', as: 'account' });

module.exports = {
  sequelize,
  Account,
  Transaction
};
