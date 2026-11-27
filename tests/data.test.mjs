import { test } from 'node:test';
import assert from 'node:assert/strict';
import { requireTenantIdentity, tenantRow, filterOwnedRows } from '../blocks/data/tenant.mjs';
import { createOwnerTableMigration } from '../blocks/data/migration.mjs';

test('tenant ownership always comes from verified identity', () => {
  assert.deepEqual(tenantRow({ userId: 'owner-1' }, { owner_id: 'attacker', name: 'x' }), { owner_id: 'owner-1', name: 'x' });
});
test('tenant filter denies cross-owner rows', () => assert.deepEqual(filterOwnedRows({ userId: 'u1' }, [{ owner_id: 'u1' }, { owner_id: 'u2' }]), [{ owner_id: 'u1' }]));
test('invalid tenant identities fail closed', () => { for (const x of [null, {}, { userId: '' }, { userId: '../x' }]) assert.throws(() => requireTenantIdentity(x)); });
test('owner migration is deterministic and fail-closed', () => {
  const migration = createOwnerTableMigration({ table: 'waf_records' });
  assert.equal(migration.version, '0.1.0');
  assert.match(migration.sql, /enable row level security/);
  assert.match(migration.sql, /to authenticated using \(\(select auth\.uid\(\)\) = owner_id\)/);
  assert.match(migration.sql, /for update[\s\S]+using[\s\S]+with check/);
  assert.doesNotMatch(migration.sql, /\bto anon\b/);
  assert.equal(migration.sql, createOwnerTableMigration({ table: 'waf_records' }).sql);
});
test('owner migration rejects injectable identifiers', () => {
  for (const input of [{}, { table: '' }, { table: 'Records' }, { table: 'x;drop table users' }, { schema: 'public.x', table: 'records' }]) {
    assert.throws(() => createOwnerTableMigration(input), TypeError);
  }
});
