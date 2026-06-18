const fs = require('fs');
const path = require('path');

/**
 * Regression test for N+1 query prevention in accounts routes.
 *
 * Incident: 2026-06-17 - commit c08c009 removed eager-loading (include)
 * from all account queries, causing sequential per-account DB queries
 * (N+1 pattern) that spiked p99 latency from 200ms to 4.2s.
 *
 * This test statically verifies that Sequelize `include` directives
 * are present in all route handlers to prevent regression.
 */

const routesFilePath = path.join(__dirname, '..', 'routes', 'accounts.js');
const routesSource = fs.readFileSync(routesFilePath, 'utf-8');

describe('accounts routes - eager loading (N+1 prevention)', () => {
  it('should use include (eager-loading) in GET /api/accounts list query', () => {
    // The findAll for the list endpoint must include Transaction association
    expect(routesSource).toMatch(/Account\.findAll\(\{[\s\S]*?include:\s*\[[\s\S]*?model:\s*Transaction[\s\S]*?\]\s*,/);
  });

  it('should use include (eager-loading) in GET /api/accounts/:id query', () => {
    // The findByPk for single account must include Transaction association
    expect(routesSource).toMatch(/Account\.findByPk\([\s\S]*?include:\s*\[[\s\S]*?model:\s*Transaction/);
  });

  it('should use include (eager-loading) in GET /api/accounts/summary/all query', () => {
    // The findAll for summary must include Transaction association
    // There should be two findAll calls with includes - verify the summary one exists
    const includeMatches = routesSource.match(/Account\.findAll\(\{[\s\S]*?include:\s*\[/g);
    expect(includeMatches).not.toBeNull();
    expect(includeMatches.length).toBeGreaterThanOrEqual(2);
  });

  it('should NOT have sequential per-account transaction queries (N+1 pattern)', () => {
    // Ensure no "for...of" loops that query transactions per account
    const hasSequentialQueries = /for\s*\(\s*const\s+account\s+of\s+accounts\s*\)\s*\{[\s\S]*?Transaction\.findAll/;
    expect(routesSource).not.toMatch(hasSequentialQueries);
  });
});
