const { Account, Transaction } = require('../models');

/**
 * Regression test for N+1 query issue in accounts routes.
 *
 * Commit c08c009 removed Sequelize eager-loading (include) from all three
 * account endpoints, replacing them with per-account loops that issued
 * individual Transaction.findAll() calls. With 50 accounts per page this
 * produced 51 DB queries per request instead of 2, causing a p99 latency
 * spike from 200 ms to 4.2 s in production.
 *
 * These tests verify that Account queries use the `include` option to
 * batch-load transactions in a single JOIN rather than issuing N+1 queries.
 */

describe('accounts-service eager-loading regression', () => {
  let findAllSpy;
  let findByPkSpy;

  beforeEach(() => {
    findAllSpy = jest.spyOn(Account, 'findAll').mockResolvedValue([]);
    findByPkSpy = jest.spyOn(Account, 'findByPk').mockResolvedValue(null);
    jest.spyOn(Account, 'count').mockResolvedValue(0);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('GET /api/accounts should eager-load transactions via include', async () => {
    const accountsRoute = require('../routes/accounts');
    const express = require('express');
    const app = express();
    app.use('/api/accounts', accountsRoute);

    const request = require('supertest');
    const res = await request(app).get('/api/accounts');

    expect(findAllSpy).toHaveBeenCalledTimes(1);
    const callArgs = findAllSpy.mock.calls[0][0];
    expect(callArgs).toHaveProperty('include');
    expect(callArgs.include).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          model: Transaction,
          as: 'transactions'
        })
      ])
    );
  });

  it('GET /api/accounts/:id should eager-load transactions via include', async () => {
    const mockAccount = {
      id: 'test-id',
      toJSON: () => ({ id: 'test-id' }),
      transactions: []
    };
    findByPkSpy.mockResolvedValue(mockAccount);

    const accountsRoute = require('../routes/accounts');
    const express = require('express');
    const app = express();
    app.use('/api/accounts', accountsRoute);

    const request = require('supertest');
    await request(app).get('/api/accounts/test-id');

    expect(findByPkSpy).toHaveBeenCalledTimes(1);
    const callArgs = findByPkSpy.mock.calls[0][1];
    expect(callArgs).toHaveProperty('include');
    expect(callArgs.include).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          model: Transaction,
          as: 'transactions'
        })
      ])
    );
  });

  it('GET /api/accounts/summary/all should eager-load transactions via include', async () => {
    const accountsRoute = require('../routes/accounts');
    const express = require('express');
    const app = express();
    app.use('/api/accounts', accountsRoute);

    const request = require('supertest');
    await request(app).get('/api/accounts/summary/all');

    expect(findAllSpy).toHaveBeenCalled();
    const summaryCall = findAllSpy.mock.calls.find(call => {
      const opts = call[0] || {};
      return opts.include && opts.include.some(inc => inc.attributes);
    });
    expect(summaryCall).toBeDefined();
    expect(summaryCall[0].include).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          model: Transaction,
          as: 'transactions'
        })
      ])
    );
  });
});
