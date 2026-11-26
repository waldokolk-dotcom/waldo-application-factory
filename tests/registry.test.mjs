import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const load = name => JSON.parse(readFileSync(new URL('../registry/'+name+'.json', import.meta.url)));
const {blocks}=load('blocks');
test('unique block identifiers',()=>assert.equal(new Set(blocks.map(b=>b.id)).size,blocks.length));
test('unverified blocks cannot be marked production ready',()=>{for(const b of blocks) {assert.ok(['planned','testing','approved'].includes(b.status)); if(b.status==='approved'){assert.equal(b.productionVerified,true);assert.match(b.version,/^\d+\.\d+\.\d+$/);} else assert.equal(b.productionVerified,false);}});
test('app block references exist',()=>{for(const a of load('apps').apps) for(const id of a.blocks) assert.ok(blocks.some(b=>b.id===id));});
