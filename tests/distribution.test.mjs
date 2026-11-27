import test from 'node:test';
import assert from 'node:assert/strict';
import { validateUpdate, canRollout, createReleaseNotice } from '../blocks/distribution/manifest.mjs';

test('validates and creates an update notice', () => {
  const update = validateUpdate({appId:'pootgenoten',blockId:'ux-design',fromVersion:'0.1.0',toVersion:'0.1.1',changeType:'minor',compatibility:['web'],rollbackVersion:'0.1.0'});
  assert.equal(update.state,'available');
  assert.equal(createReleaseNotice(update).toVersion,'0.1.1');
});

test('rollout requires compatibility and an accepted block', () => {
  const update={blockId:'ux-design',compatibility:['web']};
  assert.equal(canRollout(update,{platform:'web',acceptedBlocks:['ux-design']}),true);
  assert.equal(canRollout(update,{platform:'mobile',acceptedBlocks:['ux-design']}),false);
});