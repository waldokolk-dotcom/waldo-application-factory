import test from 'node:test';
import assert from 'node:assert/strict';
import {createChange,canPublish,approveChange} from '../blocks/change-control/manifest.mjs';
test('blocks publication without evidence',()=>{const c=createChange({appId:'pootgenoten',summary:'UX update',rollbackVersion:'0.1.0'});assert.equal(canPublish(c),false)});
test('approves only after evidence exists',()=>{let c=createChange({appId:'pootgenoten',summary:'UX update',rollbackVersion:'0.1.0'});c.evidence={previewUrl:'https://preview',screenshots:['before','after'],tests:['pass'],uxReview:'pass',laptopReview:'pass',accessibilityReview:'pass'};c=approveChange(c,'Waldo Kolk');assert.equal(c.state,'approved');assert.equal(canPublish(c),true)});
