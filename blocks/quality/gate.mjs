// v0.2.0 — fail-closed, commit-bound release evidence gate.
export const REQUIRED_GATES = Object.freeze(['unit', 'integration', 'security', 'accessibility', 'journeys', 'visual', 'performance']);
const SHA=/^[a-f0-9]{40}$/;
const RUN=/^https:\/\/github\.com\/[a-z0-9_.-]+\/[a-z0-9_.-]+\/actions\/runs\/[1-9]\d*$/i;
export function createEvidence({id,status,runUrl,commit,recordedAt,artifactSha256}){
  if(!REQUIRED_GATES.includes(id)||status!=='pass'||!RUN.test(runUrl??'')||!SHA.test(commit??'')||Number.isNaN(Date.parse(recordedAt??''))||(artifactSha256!==undefined&&!/^[a-f0-9]{64}$/.test(artifactSha256)))throw new TypeError('Invalid quality evidence');
  return Object.freeze({id,status,proof:Object.freeze({runUrl,commit,recordedAt,...(artifactSha256?{artifactSha256}: {})})});
}

export function evaluateRelease(evidence, required = REQUIRED_GATES) {
  const records = Array.isArray(evidence) ? evidence : [];
  const byId = new Map(records.map(item => [item?.id, item]));
  const failures = [];
  for (const id of required) {
    const item = byId.get(id);
    if (!item) failures.push({ id, reason: 'missing' });
    else if (item.status !== 'pass') failures.push({ id, reason: item.status || 'invalid' });
    else if (!item.proof || !RUN.test(item.proof.runUrl ?? '') || !SHA.test(item.proof.commit ?? '') || Number.isNaN(Date.parse(item.proof.recordedAt ?? ''))) failures.push({ id, reason: 'proof-invalid' });
  }
  return Object.freeze({ passed: failures.length === 0, failures: Object.freeze(failures) });
}
