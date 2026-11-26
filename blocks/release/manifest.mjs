import { evaluateRelease } from '../quality/gate.mjs';

// v0.1.0 — immutable release receipt; creation is refused without complete evidence.
export function createReleaseManifest({ app, version, commit, evidence, createdAt = new Date().toISOString() }) {
  if (!/^[a-z][a-z0-9-]{1,63}$/.test(app || '')) throw new TypeError('Invalid app id');
  if (!/^\d+\.\d+\.\d+$/.test(version || '')) throw new TypeError('Semantic version required');
  if (!/^[a-f0-9]{40}$/.test(commit || '')) throw new TypeError('Full commit SHA required');
  const gate = evaluateRelease(evidence);
  if (!gate.passed) throw new Error(`Release blocked: ${gate.failures.map(x => `${x.id}:${x.reason}`).join(', ')}`);
  return Object.freeze({ schemaVersion: 1, app, version, commit, createdAt, evidence: Object.freeze([...evidence]) });
}
