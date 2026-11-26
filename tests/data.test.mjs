import { test } from 'node:test';
import assert from 'node:assert/strict';
import { requireTenantIdentity, tenantRow, filterOwnedRows } from '../blocks/data/tenant.mjs';

test('tenant ownership always comes from verified identity', () => {
  assert.deepEqual(tenantRow({ userId: 'owner-1' }, { owner_id: 'attacker', name: 'x' }), { owner_id: 'owner-1', name: 'x' });
});
test('tenant filter denies cross-owner rows', () => assert.deepEqual(filterOwnedRows({ userId: 'u1' }, [{ owner_id: 'u1' }, { owner_id: 'u2' }]), [{ owner_id: 'u1' }]));
test('invalid tenant identities fail closed', () => { for (const x of [null, {}, { userId: '' }, { userId: '../x' }]) assert.throws(() => requireTenantIdentity(x)); });
