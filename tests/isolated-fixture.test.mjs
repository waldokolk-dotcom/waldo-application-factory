import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createIsolatedFixture} from '../blocks/quality/isolated-fixture.mjs';

test('isolated two-user fixture denies cross-user access, tampering, malformed tokens and cleans up',async()=>{
  const f=createIsolatedFixture();
  try {
    const [a,b]=f.users;
    const tokenA='Bearer fixture0.test.token';
    const tokenB='Bearer fixture1.test.token';
    assert.deepEqual(await f.authenticate(tokenA),a);
    assert.deepEqual(await f.authenticate(tokenB),b);
    assert.equal(await f.authenticate('Bearer fixture0.test.invalid'),null);
    assert.equal(await f.authenticate('Bearer fixture0.test.token extra'),null);
    assert.equal(f.ownsResource(a,b.userId),false);
    assert.equal(f.ownsResource(b,a.userId),false);
    f.rows.push(f.tenantRow(a,{owner_id:b.userId,value:'a'}));
    f.rows.push(f.tenantRow(b,{owner_id:a.userId,value:'b'}));
    assert.deepEqual(f.filterOwnedRows(a,f.rows).map(row=>row.value),['a']);
    assert.deepEqual(f.filterOwnedRows(b,f.rows).map(row=>row.value),['b']);
    assert.throws(()=>f.tenantRow(null,{value:'invalid'}),TypeError);
  } finally {f.cleanup();}
  assert.deepEqual(f.rows,[]);
  assert.equal(await f.authenticate('Bearer fixture0.test.token'),null);
});
