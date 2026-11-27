// Real local GoTrue/Mailpit acceptance test. Never sends mail or writes to hosted projects.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

const API = 'http://127.0.0.1:54321';
const MAIL = 'http://127.0.0.1:54324';
const key = process.env.WAF_LOCAL_SUPABASE_KEY;
if (process.env.WAF_LOCAL_AUTH !== '1' || !key || /^https?:/.test(key)) {
  throw new Error('Local-only acceptance environment and publishable key required');
}
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function auth(path, method = 'GET', body, token) {
  const response = await fetch(API + '/auth/v1/' + path, {
    method,
    headers: {
      apikey: key,
      'content-type': 'application/json',
      ...(token ? { authorization: 'Bearer ' + token } : {})
    },
    ...(body === undefined ? {} : {body: JSON.stringify(body)}),
    signal: AbortSignal.timeout(15000)
  });
  const result = await response.text();
  let json;
  try { json = JSON.parse(result); } catch { json = null; }
  return {status: response.status, json};
}
async function mailFor(address, exclude = new Set()) {
  for (let attempt = 0; attempt < 30; attempt++) {
    const listResponse = await fetch(MAIL + '/api/v1/messages?limit=50', {signal: AbortSignal.timeout(5000)});
    assert.equal(listResponse.status, 200, 'Mailpit API must be reachable');
    const list = await listResponse.json();
    const found = (list.messages || []).find(m =>
      !exclude.has(m.ID) && (m.To || []).some(to => to.Address?.toLowerCase() === address.toLowerCase()));
    if (found) {
      const details = await fetch(MAIL + '/api/v1/message/' + encodeURIComponent(found.ID));
      assert.equal(details.status, 200);
      return {id: found.ID, message: await details.json()};
    }
    await sleep(500);
  }
  throw new Error('Expected local email not found in Mailpit');
}
async function followEmailLink(mail, type) {
  const raw = [mail.HTML, mail.Text].filter(Boolean).join('\n').replaceAll('&amp;', '&').replaceAll('&#38;', '&');
  const matches = raw.match(/http:\/\/127\.0\.0\.1:54321\/auth\/v1\/verify\?[^\s"'<>]+/g) || [];
  const link = matches.find(value => value.includes('type=' + type));
  assert.ok(link, 'Expected a ' + type + ' confirmation link in Mailpit');
  const response = await fetch(link, {redirect:'manual',signal:AbortSignal.timeout(15000)});
  assert.ok([200,302,303,307,308].includes(response.status), 'Supabase did not accept email link');
  return response.headers.get('location') || '';
}
async function signIn(email, password) {
  const r = await auth('token?grant_type=password', 'POST', {email,password});
  assert.equal(r.status, 200, 'Password sign-in failed: ' + r.json?.error_code);
  assert.ok(r.json?.access_token && r.json?.refresh_token && r.json?.user?.id);
  return r.json;
}
async function data(method, token, body, query = '') {
  const response = await fetch(API + '/rest/v1/waf_test_records' + query, {
    method,
    headers: {
      apikey: key,
      'content-type': 'application/json',
      prefer: 'return=representation',
      ...(token ? {authorization: 'Bearer ' + token} : {})
    },
    ...(body === undefined ? {} : {body:JSON.stringify(body)}),
    signal: AbortSignal.timeout(15000)
  });
  const result = await response.text();
  let json;
  try {json=JSON.parse(result);} catch {json=null;}
  return {status:response.status,json};
}
async function exerciseRls(userA,userB) {
  const inserted=[];
  try {
    const insertA=await data('POST',userA.access_token,{owner_id:userA.user.id,value:'alpha'});
    assert.equal(insertA.status,201,'Owner A insert must succeed');
    assert.equal(insertA.json?.[0]?.owner_id,userA.user.id);
    inserted.push([userA.access_token,insertA.json[0].id]);
    const insertB=await data('POST',userB.access_token,{owner_id:userB.user.id,value:'beta'});
    assert.equal(insertB.status,201,'Owner B insert must succeed');
    assert.equal(insertB.json?.[0]?.owner_id,userB.user.id);
    inserted.push([userB.access_token,insertB.json[0].id]);
    const spoof=await data('POST',userA.access_token,{owner_id:userB.user.id,value:'spoofed'});
    assert.ok([401,403].includes(spoof.status),'Owner spoofing must be rejected');
    const readA=await data('GET',userA.access_token,undefined,'?select=id,owner_id,value');
    const readB=await data('GET',userB.access_token,undefined,'?select=id,owner_id,value');
    assert.equal(readA.status,200);
    assert.equal(readB.status,200);
    assert.deepEqual(readA.json.map(x=>x.value),['alpha'],'User A must not see user B');
    assert.deepEqual(readB.json.map(x=>x.value),['beta'],'User B must not see user A');
    const anonymous=await data('GET',null,undefined,'?select=id');
    assert.ok([200,401,403].includes(anonymous.status));
    if (anonymous.status===200) assert.deepEqual(anonymous.json,[],'Anon access must not expose rows');
    const tamper=await data('PATCH',userA.access_token,{owner_id:userB.user.id},
      '?id=eq.'+insertA.json[0].id);
    assert.ok([401,403].includes(tamper.status),'Changing row owner must be forbidden');
    const crossDelete=await data('DELETE',userA.access_token,undefined,
      '?id=eq.'+insertB.json[0].id);
    assert.ok([200,204].includes(crossDelete.status),'Cross-owner delete must be filtered');
    const bAfter=await data('GET',userB.access_token,undefined,'?select=value');
    assert.deepEqual(bAfter.json?.map(x=>x.value),['beta'],'Cross-owner delete must not remove data');
  } finally {
    for (const [jwt,id] of inserted) {
      await data('DELETE',jwt,undefined,'?id=eq.'+id).catch(()=>{});
    }
  }
}
test('real local signup, Mailpit confirmation, sign-in, user isolation, recovery and logout', {timeout: 95000}, async () => {
  const suffix = randomUUID().replaceAll('-', '').slice(0,20);
  const a = 'waf-a-' + suffix + '@example.invalid';
  const b = 'waf-b-' + suffix + '@example.invalid';
  const password = 'Test-Only-' + randomUUID() + '!aA9';
  const seen = new Set();
  for (const email of [a,b]) {
    const signed = await auth('signup', 'POST', {email,password});
    assert.ok([200,201].includes(signed.status), 'Signup failed: ' + signed.json?.error_code);
    const mail = await mailFor(email);
    seen.add(mail.id);
    await followEmailLink(mail.message, 'signup');
  }
  const userA = await signIn(a,password);
  const userB = await signIn(b,password);
  assert.notEqual(userA.user.id, userB.user.id);
  for (const [session, email] of [[userA,a],[userB,b]]) {
    const current = await auth('user', 'GET', undefined, session.access_token);
    assert.equal(current.status,200);
    assert.equal(current.json?.email,email);
  }
  assert.ok([401,403].includes((await auth('user', 'GET', undefined, 'invalid')).status), 'Invalid token must be denied');
  assert.ok([401,403].includes((await auth('admin/users','GET',undefined,userA.access_token)).status),
    'Normal users must not access the admin API');
  await exerciseRls(userA,userB);
  const recovery = await auth('recover','POST',{email:a});
  assert.ok([200,204].includes(recovery.status),'Recovery request failed');
  const recoveryMail = await mailFor(a,seen);
  const redirect = await followEmailLink(recoveryMail.message,'recovery');
  const callback = new URL(redirect,API);
  const fragment = new URLSearchParams(callback.hash.slice(1));
  assert.equal(fragment.get('type'),'recovery','Expected recovery callback');
  const recoveryToken = fragment.get('access_token');
  assert.ok(recoveryToken,'Recovery access token required');
  const recovered = await auth('user','GET',undefined,recoveryToken);
  assert.equal(recovered.status,200);
  assert.equal(recovered.json?.id,userA.user.id);
  const newPassword = 'Reset-Only-' + randomUUID() + '!aA9';
  const changed = await auth('user','PUT',{password:newPassword},recoveryToken);
  assert.equal(changed.status,200,'Password change failed');
  const old = await auth('token?grant_type=password','POST',{email:a,password});
  assert.ok([400,401,403].includes(old.status),'Old password must fail');
  const fresh = await signIn(a,newPassword);
  assert.equal(fresh.user.id,userA.user.id);
  const refreshed = await auth('token?grant_type=refresh_token','POST',{refresh_token:fresh.refresh_token});
  assert.equal(refreshed.status,200,'Refresh must succeed');
  assert.ok(refreshed.json?.access_token && refreshed.json?.refresh_token);
  const logoutA = await auth('logout?scope=global','POST',{},refreshed.json.access_token);
  assert.ok([200,204].includes(logoutA.status));
  const revoked = await auth('token?grant_type=refresh_token','POST',{refresh_token:refreshed.json.refresh_token});
  assert.ok([400,401,403].includes(revoked.status),'Revoked refresh token must fail');
  // Existing access JWTs may remain valid until expiry; do not claim immediate JWT revocation.
  assert.equal((await auth('user','GET',undefined,userB.access_token)).status,200,'Other account remains unaffected');
  const signOut = await auth('logout','POST',{},userB.access_token);
  assert.ok([200,204].includes(signOut.status),'Logout failed');
  // Local Supabase stack is destroyed with supabase stop --no-backup in workflow finally.
});
