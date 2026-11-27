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
  assert.equal((await auth('user', 'GET', undefined, 'invalid')).status, 401);
  assert.ok([401,403].includes((await auth('admin/users','GET',undefined,userA.access_token)).status),
    'Normal users must not access the admin API');
  const recovery = await auth('recover','POST',{email:a});
  assert.ok([200,204].includes(recovery.status),'Recovery request failed');
  const recoveryMail = await mailFor(a,seen);
  await followEmailLink(recoveryMail.message,'recovery');
  const signOut = await auth('logout','POST',{},userB.access_token);
  assert.ok([200,204].includes(signOut.status),'Logout failed');
  // Local Supabase stack is destroyed with supabase stop --no-backup in workflow finally.
});
