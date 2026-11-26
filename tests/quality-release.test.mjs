import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateRelease, REQUIRED_GATES } from '../blocks/quality/gate.mjs';
import { createReleaseManifest } from '../blocks/release/manifest.mjs';
const evidence = REQUIRED_GATES.map(id => ({ id, status: 'pass', proof: `run:${id}` }));
test('quality gate fails closed on missing, failed or unproved evidence', () => {
  assert.equal(evaluateRelease(evidence).passed, true);
  assert.equal(evaluateRelease(evidence.slice(1)).passed, false);
  assert.equal(evaluateRelease(evidence.map(x => x.id === 'security' ? { ...x, status: 'fail' } : x)).passed, false);
  assert.equal(evaluateRelease(evidence.map(x => x.id === 'visual' ? { ...x, proof: '' } : x)).passed, false);
});
test('release manifest requires semver, full commit and complete evidence', () => {
  const manifest = createReleaseManifest({ app: 'verbindo', version: '8.2.0', commit: 'a'.repeat(40), evidence, createdAt: '2026-11-26T00:00:00.000Z' });
  assert.equal(manifest.app, 'verbindo');
  assert.throws(() => createReleaseManifest({ app: 'verbindo', version: '8.2', commit: 'a'.repeat(40), evidence }));
  assert.throws(() => createReleaseManifest({ app: 'verbindo', version: '8.2.0', commit: 'a'.repeat(40), evidence: [] }));
});
