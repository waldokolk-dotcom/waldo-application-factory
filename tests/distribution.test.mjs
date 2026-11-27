import test from 'node:test';
import assert from 'node:assert/strict';
import { validateUpdate, canRollout, createReleaseNotice } from '../blocks/distribution/manifest.mjs';
const valid = {appId:'reference',blockId:'api',fromVersion:'0.1.0',toVersion:'0.2.0',changeType:'minor',compatibility:['web'],rollbackVersion:'0.1.0',targetCommit:'a'.repeat(40),evidenceRun:'https://github.com/waldokolk-dotcom/app/actions/runs/123',rolloutPercent:10};
test('creates a commit-bound staged release notice',()=>{const update=validateUpdate(valid);assert.equal(update.state,'available');assert.equal(createReleaseNotice(update).targetCommit,'a'.repeat(40));});
test('rollout requires matching app, platform and approved installed version',()=>{const app={appId:'reference',platform:'web',acceptedBlocks:[{id:'api',version:'0.1.0',status:'approved'}]};assert.equal(canRollout(valid,app),true);assert.equal(canRollout(valid,{...app,platform:'mobile'}),false);assert.equal(canRollout(valid,{...app,acceptedBlocks:[{id:'api',version:'0.0.9',status:'approved'}]}),false);});
test('rejects placeholder evidence, unsafe rollback and invalid rollout bounds',()=>{for(const update of [{...valid,evidenceRun:'https://example.com/pass'},{...valid,targetCommit:'abc'},{...valid,rollbackVersion:'0.0.9'},{...valid,rolloutPercent:0},{...valid,compatibility:['desktop']}]) assert.throws(()=>validateUpdate(update));});
