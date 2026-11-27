import test from 'node:test';
import assert from 'node:assert/strict';
import {createChange,attachEvidence,canPublish,approveChange} from '../blocks/change-control/manifest.mjs';
const input={appId:'reference',summary:'API update',targetCommit:'b'.repeat(40),rollbackVersion:'0.1.0'};
const evidence={previewUrl:'https://preview.example.test/release',screenshots:['https://artifacts.example.test/before.png','https://artifacts.example.test/after.png'],qualityRun:'https://github.com/waldokolk-dotcom/app/actions/runs/456',uxReview:'pass',laptopReview:'pass',accessibilityReview:'pass'};
test('blocks publication until reviewed evidence, rollback and approval exist',()=>{let change=createChange(input);assert.equal(canPublish(change),false);change=attachEvidence(change,evidence,true);assert.equal(canPublish(change),false);change=approveChange(change,'Waldo Kolk','2026-11-27T19:00:00.000Z');assert.equal(canPublish(change),true);});
test('rejects placeholder proof, failed reviews and unverified rollback',()=>{const change=createChange(input);assert.throws(()=>attachEvidence(change,{...evidence,screenshots:['before','after']},true));assert.throws(()=>attachEvidence(change,{...evidence,accessibilityReview:'fail'},true));assert.throws(()=>attachEvidence(change,evidence,false));assert.throws(()=>approveChange(change,'reviewer'));});
test('requires exact commit and semantic rollback version',()=>{assert.throws(()=>createChange({...input,targetCommit:'short'}));assert.throws(()=>createChange({...input,rollbackVersion:'latest'}));});
