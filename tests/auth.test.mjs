import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createAuthenticator,ownsResource} from '../blocks/auth/server.mjs';
const token='Bearer abc.def.ghi';
test('identity comes from server verification, not metadata',async()=>{
 const auth=createAuthenticator({auth:{getUser:async t=>{assert.equal(t,'abc.def.ghi');return {data:{user:{id:'u1',user_metadata:{role:'owner'}}}};}}});
 assert.deepEqual(await auth(token),{userId:'u1'});
});
test('reject malformed headers without network call',async()=>{
 const auth=createAuthenticator({auth:{getUser:()=>assert.fail('unexpected call')}});
 for(const h of [null,undefined,[], 'Basic abc','Bearer abc','Bearer abc.def.ghi extra','Bearer abc.def.ghi\n','Bearer '+ 'x'.repeat(8192)]) assert.equal(await auth(h),null);
});
test('reject expired or invalid token and upstream failures',async()=>{
 for(const getUser of [async()=>({error:{message:'expired'},data:{user:{id:'u1'}}}),async()=>({data:{user:null}}),async()=>{throw Error('offline')},async()=>({data:{user:{id:''}}})]) assert.equal(await createAuthenticator({auth:{getUser}})(token),null);
});
test('ownership denies cross-user and missing identity',()=>{
 assert.equal(ownsResource({userId:'u1'},'u1'),true);
 assert.equal(ownsResource({userId:'u1'},'u2'),false);
 assert.equal(ownsResource(null,undefined),false);
 assert.equal(ownsResource({userId:''},''),false);
});
test('reject invalid client',()=>assert.throws(()=>createAuthenticator({}),TypeError));
