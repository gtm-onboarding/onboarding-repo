const express = require('express');
const { sequelize, Account, Transaction } = require('../models');
const { fn, col, literal } = require('sequelize');
const router = express.Router();

// GET /api/accounts - List all accounts with their recent transactions
router.get('/', async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;

    const { count: total, rows: accounts } = await Account.findAndCountAll({
      where,
      include: [{
        model: Transaction,
        as: 'transactions',
        separate: true,
        order: [['processedAt', 'DESC']]
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    const data = accounts.map(account => {
      const json = account.toJSON();
      json.transactions = (json.transactions || []).slice(0, 10);
      return json;
    });

    res.json({
      data,
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
    const account = await Account.findByPk(req.params.id, {
      include: [{
        model: Transaction,
        as: 'transactions',
        order: [['processedAt', 'DESC']],
        separate: true
      }]
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json({ data: account });
  } catch (error) {
    console.error('Error fetching account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/accounts/summary - Account summary with transaction counts
router.get('/summary/all', async (req, res) => {
  try {
    const rows = await Account.findAll({
      attributes: [
        'id',
        'customerName',
        'accountNumber',
        'balance',
        [fn('COUNT', col('transactions.id')), 'transactionCount'],
        [fn('COALESCE', fn('SUM',
          literal("CASE WHEN \"transactions\".\"type\" = 'credit' THEN \"transactions\".\"amount\" ELSE 0 END")
        ), 0), 'totalCredits'],
        [fn('COALESCE', fn('SUM',
          literal("CASE WHEN \"transactions\".\"type\" = 'debit' THEN \"transactions\".\"amount\" ELSE 0 END")
        ), 0), 'totalDebits']
      ],
      include: [{
        model: Transaction,
        as: 'transactions',
        attributes: []
      }],
      group: ['Account.id'],
      raw: true
    });

    const summary = rows.map(row => ({
      ...row,
      transactionCount: parseInt(row.transactionCount, 10),
      totalCredits: parseFloat(row.totalCredits),
      totalDebits: parseFloat(row.totalDebits)
    }));

    res.json({ data: summary });
  } catch (error) {
    console.error('Error fetching account summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
