import { evaluateRelease } from '../quality/gate.mjs';

// v0.2.0 — immutable release receipt; creation is refused without complete evidence.
export function createReleaseManifest({ app, version, commit, evidence, deployment, rollback, createdAt = new Date().toISOString() }) {
  if (!/^[a-z][a-z0-9-]{1,63}$/.test(app || '')) throw new TypeError('Invalid app id');
  if (!/^\d+\.\d+\.\d+$/.test(version || '')) throw new TypeError('Semantic version required');
  if (!/^[a-f0-9]{40}$/.test(commit || '')) throw new TypeError('Full commit SHA required');
  const gate = evaluateRelease(evidence);
  if (!gate.passed) throw new Error(`Release blocked: ${gate.failures.map(x => `${x.id}:${x.reason}`).join(', ')}`);
  if(deployment?.provider!=='render'||deployment.liveCommit!==commit||!/^https:\/\/[a-z0-9.-]+\/api\/health$/i.test(deployment.healthUrl??'')||Number.isNaN(Date.parse(deployment.verifiedAt??'')))throw new TypeError('Verified deployment receipt required');
  if(!/^[a-f0-9]{40}$/.test(rollback?.commit??'')||rollback.commit===commit||typeof rollback.procedure!=='string'||rollback.procedure.trim().length<20||Number.isNaN(Date.parse(rollback.verifiedAt??'')))throw new TypeError('Verified rollback plan required');
  return Object.freeze({ schemaVersion: 2, app, version, commit, createdAt, evidence: Object.freeze([...evidence]),deployment:Object.freeze({...deployment}),rollback:Object.freeze({...rollback}) });
}
