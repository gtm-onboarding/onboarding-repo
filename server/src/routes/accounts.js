const express = require('express');
const { Account, Transaction } = require('../models');
const router = express.Router();

// GET /api/accounts - List all accounts with their recent transactions
router.get('/', async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;

    const accounts = await Account.findAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    // Fetch transactions for each account
    const accountsWithTransactions = [];
    for (const account of accounts) {
      const transactions = await Transaction.findAll({
        where: { accountId: account.id },
        limit: 10,
        order: [['processedAt', 'DESC']]
      });
      accountsWithTransactions.push({
        ...account.toJSON(),
        transactions
      });
    }

    const total = await Account.count({ where });

    res.json({
      data: accountsWithTransactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/accounts/:id - Get single account with full transaction history
router.get('/:id', async (req, res) => {
  try {
    const account = await Account.findByPk(req.params.id);

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const transactions = await Transaction.findAll({
      where: { accountId: account.id },
      order: [['processedAt', 'DESC']]
    });

    res.json({
      data: {
        ...account.toJSON(),
        transactions
      }
    });
  } catch (error) {
    console.error('Error fetching account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/accounts/summary - Account summary with transaction counts
router.get('/summary/all', async (req, res) => {
  try {
    const accounts = await Account.findAll();

    const summary = [];
    for (const account of accounts) {
      const transactions = await Transaction.findAll({
        where: { accountId: account.id },
        attributes: ['id', 'amount', 'type']
      });

      summary.push({
        id: account.id,
        customerName: account.customerName,
        accountNumber: account.accountNumber,
        balance: account.balance,
        transactionCount: transactions.length,
        totalCredits: transactions
          .filter(t => t.type === 'credit')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0),
        totalDebits: transactions
          .filter(t => t.type === 'debit')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0)
      });
    }

    res.json({ data: summary });
  } catch (error) {
    console.error('Error fetching account summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
