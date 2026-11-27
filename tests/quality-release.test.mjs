import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createEvidence, evaluateRelease, REQUIRED_GATES } from '../blocks/quality/gate.mjs';
import { createReleaseManifest } from '../blocks/release/manifest.mjs';
const commit='a'.repeat(40);
const evidence = REQUIRED_GATES.map((id,index) => createEvidence({id,status:'pass',runUrl:`https://github.com/waldo/waf/actions/runs/${index+1}`,commit,recordedAt:'2026-11-26T00:00:00.000Z'}));
test('quality gate fails closed on missing, failed or unproved evidence', () => {
  assert.equal(evaluateRelease(evidence).passed, true);
  assert.equal(evaluateRelease(evidence.slice(1)).passed, false);
  assert.equal(evaluateRelease(evidence.map(x => x.id === 'security' ? { ...x, status: 'fail' } : x)).passed, false);
  assert.equal(evaluateRelease(evidence.map(x => x.id === 'visual' ? { ...x, proof: {} } : x)).passed, false);
  assert.throws(()=>createEvidence({id:'visual',status:'pass',runUrl:'http://example.test/1',commit,recordedAt:'now'}));
});
test('release manifest requires semver, full commit and complete evidence', () => {
  const deployment={provider:'render',liveCommit:commit,healthUrl:'https://app.example.test/api/health',verifiedAt:'2026-11-26T01:00:00.000Z'};
  const rollback={commit:'b'.repeat(40),procedure:'Revert merge and deploy the recorded compatible commit.',verifiedAt:'2026-11-26T01:01:00.000Z'};
  const manifest = createReleaseManifest({ app: 'verbindo', version: '8.2.0', commit, evidence, deployment, rollback, createdAt: '2026-11-26T00:00:00.000Z' });
  assert.equal(manifest.app, 'verbindo');
  assert.equal(manifest.schemaVersion,2);
  assert.throws(() => createReleaseManifest({ app: 'verbindo', version: '8.2', commit, evidence, deployment, rollback }));
  assert.throws(() => createReleaseManifest({ app: 'verbindo', version: '8.2.0', commit, evidence: [], deployment, rollback }));
  assert.throws(() => createReleaseManifest({ app: 'verbindo', version: '8.2.0', commit, evidence, deployment:{...deployment,liveCommit:'c'.repeat(40)}, rollback }));
  assert.throws(() => createReleaseManifest({ app: 'verbindo', version: '8.2.0', commit, evidence, deployment, rollback:{...rollback,commit} }));
});
