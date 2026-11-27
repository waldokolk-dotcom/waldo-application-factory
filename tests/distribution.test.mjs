import {test} from 'node:test';import assert from 'node:assert/strict';import {mkdtemp,rm,readFile} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';import {createHash} from 'node:crypto';import {exportBlocks} from '../distribution/export.mjs';
test('independent export is pinned, verifiable and refuses unverified production',async()=>{const dir=await mkdtemp(join(tmpdir(),'waf-'));const commit='a'.repeat(40);try{await assert.rejects(exportBlocks({appId:'verbindo',destination:join(dir,'prod'),commit}),/Unverified block/);await assert.rejects(exportBlocks({appId:'unknown',destination:join(dir,'unknown'),commit,production:false}),/Unknown application/);const dest=join(dir,'preview');const m=await exportBlocks({appId:'verbindo',destination:dest,commit,production:false});assert.equal(m.commit,commit);assert.equal(m.production,false);for(const b of m.blocks)assert.equal(createHash('sha256').update(await readFile(join(dest,b.path))).digest('hex'),b.sha256);await assert.rejects(exportBlocks({appId:'verbindo',destination:dest,commit,production:false}));}finally{await rm(dir,{recursive:true,force:true});}});

import {execFileSync} from 'node:child_process';
test('exported consumer runs independently from factory checkout',async()=>{const dir=await mkdtemp(join(tmpdir(),'waf-consumer-'));try{const dest=join(dir,'consumer');await exportBlocks({appId:'verbindo',destination:dest,commit:'b'.repeat(40),production:false});const program=`
import assert from 'node:assert/strict';
import {createAuthenticator,ownsResource} from './blocks/auth/server.mjs';
import {tenantRow,filterOwnedRows} from './blocks/data/tenant.mjs';
import {createReleaseManifest} from './blocks/release/manifest.mjs';
import {REQUIRED_GATES} from './blocks/quality/gate.mjs';
const auth=createAuthenticator({auth:{getUser:async token=>({data:{user:token==='a.b.c'?{id:'owner'}:null}})}});
const identity=await auth('Bearer a.b.c');
assert.equal(ownsResource(identity,'owner'),true);
assert.equal(ownsResource(identity,'other'),false);
assert.equal(await auth('Bearer invalid'),null);
assert.equal(tenantRow(identity,{owner_id:'other'}).owner_id,'owner');
assert.equal(filterOwnedRows(identity,[{owner_id:'other'},{owner_id:'owner'}]).length,1);
assert.throws(()=>createReleaseManifest({app:'verbindo',version:'1.0.0',commit:'b'.repeat(40),evidence:[]}));
assert.equal(createReleaseManifest({app:'verbindo',version:'1.0.0',commit:'b'.repeat(40),evidence:REQUIRED_GATES.map(id=>({id,status:'pass',proof:'fixture only'}))}).app,'verbindo');
console.log('consumer smoke passed');
`;assert.match(execFileSync(process.execPath,['--input-type=module','-e',program],{cwd:dest,encoding:'utf8',env:{PATH:process.env.PATH}}),/consumer smoke passed/);}finally{await rm(dir,{recursive:true,force:true});}});
