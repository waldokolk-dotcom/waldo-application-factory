import test from 'node:test';
import assert from 'node:assert/strict';
import {runAcceptance} from '../reference-app/acceptance.mjs';
const input={commit:'c'.repeat(40),runUrl:'https://github.com/waldokolk-dotcom/waldo-application-factory/actions/runs/123',origin:'https://waf-reference.example.test',now:'2026-11-27T20:00:00.000Z'};
test('isolated reference app accepts all remaining operational blocks',()=>{const report=runAcceptance(input);assert.equal(report.passed,true);assert.equal(Object.keys(report.blocks).length,13);assert.equal(Object.values(report.blocks).every(x=>x.passed),true);});
test('reference acceptance refuses unbound deployment evidence',()=>{assert.throws(()=>runAcceptance({...input,commit:'short'}));assert.throws(()=>runAcceptance({...input,runUrl:'https://example.test/pass'}));});
