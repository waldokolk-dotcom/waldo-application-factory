// Deterministic two-user fixture for server boundaries. No production accounts.
import { randomUUID } from 'node:crypto';
import { createAuthenticator, ownsResource } from '../auth/server.mjs';
import { filterOwnedRows, tenantRow } from '../data/tenant.mjs';

export function createIsolatedFixture() {
  const marker = randomUUID();
  const users = Object.freeze([{userId:'fixture_a_'+marker},{userId:'fixture_b_'+marker}]);
  const tokens = new Map(users.map((u,i)=>['fixture'+i+'.test.token', u.userId]));
  const client = {auth:{getUser:async token => {
    const id=tokens.get(token);
    return id ? {data:{user:{id}},error:null} : {data:{user:null},error:{message:'invalid token'}};
  }}};
  const authenticate=createAuthenticator(client);
  const rows=[];
  const cleanup=()=>{tokens.clear();rows.splice(0);};
  return {users,authenticate,ownsResource,tenantRow,filterOwnedRows,rows,cleanup};
}
