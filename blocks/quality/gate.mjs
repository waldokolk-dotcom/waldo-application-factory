// v0.1.0 — fail-closed release evidence gate.
export const REQUIRED_GATES = Object.freeze(['unit', 'integration', 'security', 'accessibility', 'journeys', 'visual', 'performance']);

export function evaluateRelease(evidence, required = REQUIRED_GATES) {
  const records = Array.isArray(evidence) ? evidence : [];
  const byId = new Map(records.map(item => [item?.id, item]));
  const failures = [];
  for (const id of required) {
    const item = byId.get(id);
    if (!item) failures.push({ id, reason: 'missing' });
    else if (item.status !== 'pass') failures.push({ id, reason: item.status || 'invalid' });
    else if (typeof item.proof !== 'string' || !item.proof.trim()) failures.push({ id, reason: 'proof-missing' });
  }
  return Object.freeze({ passed: failures.length === 0, failures: Object.freeze(failures) });
}
