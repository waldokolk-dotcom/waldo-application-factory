import { test } from 'node:test';
import assert from 'node:assert/strict';
import { boundedString, json, problem } from '../blocks/api/http.mjs';
import { fetchJson } from '../blocks/api/connector.mjs';
import { createOpenApi, validateOpenApi } from '../blocks/api/openapi.mjs';
test('bounded strings normalize safe input', () => assert.equal(boundedString('  Utrecht  '), 'Utrecht'));
test('bounded strings reject wrong types and limits', () => { for (const x of [null, '', 'x'.repeat(1001)]) assert.throws(() => boundedString(x)); });
test('responses keep success and failure status families separate', () => { assert.equal(json(200, {}).status, 200); assert.equal(problem(403, 'forbidden', 'Denied').body.type, 'urn:waf:forbidden'); assert.throws(() => json(500, {})); });
test('OpenAPI contract requires versioned operations and success responses',()=>{const doc=createOpenApi({title:'Status',version:'1.0.0',paths:{'/status':{get:{operationId:'getStatus',responses:{200:{description:'OK'}}}}}});assert.equal(validateOpenApi(doc),doc);assert.throws(()=>createOpenApi({title:'Bad',version:'1',paths:{}}));assert.throws(()=>createOpenApi({title:'Bad',version:'1.0.0',paths:{'/x':{get:{operationId:'x',responses:{403:{description:'no'}}}}}}));});
test('connector accepts bounded JSON from explicitly allowed HTTPS origin',async()=>{let options;const data=await fetchJson('https://api.example.test/v1/status',{allowedOrigins:['https://api.example.test'],fetcher:async(url,o)=>{options=o;return new Response(JSON.stringify({ok:true}),{headers:{'content-type':'application/json'}});}});assert.deepEqual(data,{ok:true});assert.equal(options.redirect,'error');assert.equal(options.headers.get('authorization'),null);});
test('connector fails closed on target, redirect, type, size and upstream errors',async()=>{
  await assert.rejects(fetchJson('http://api.example.test/x',{allowedOrigins:['http://api.example.test']}),/not allowed/);
  await assert.rejects(fetchJson('https://other.example/x',{allowedOrigins:['https://api.example.test']}),/not allowed/);
  const base={allowedOrigins:['https://api.example.test']};
  await assert.rejects(fetchJson('https://api.example.test/x',{...base,fetcher:async()=>new Response('no',{status:503,headers:{'content-type':'application/json'}})}),e=>e.status===502&&e.upstreamStatus===503);
  await assert.rejects(fetchJson('https://api.example.test/x',{...base,fetcher:async()=>new Response('text',{headers:{'content-type':'text/plain'}})}),/JSON/);
  await assert.rejects(fetchJson('https://api.example.test/x',{...base,maxBytes:4,fetcher:async()=>new Response('{"ok":true}',{headers:{'content-type':'application/json'}})}),/too large/);
});
