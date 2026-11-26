// v0.1.0 — evidence-backed UX pattern decisions, without copying product identity.
export const UX_REFERENCES = Object.freeze({
  'mobbin-search': Object.freeze({
    source: 'Mobbin',
    url: 'https://mobbin.com/explore/web/flows/searching-finding',
    pattern: 'Search flows combine a clear entry point, suggestions and a dedicated result state.'
  }),
  'mobbin-filter': Object.freeze({
    source: 'Mobbin',
    url: 'https://mobbin.com/explore/web/flows/filtering-sorting',
    pattern: 'Filters visibly update results and retain a recoverable no-results state.'
  }),
  'atlassian-empty': Object.freeze({
    source: 'Atlassian Design System',
    url: 'https://atlassian.design/content/designing-messages/empty-state/',
    pattern: 'Empty states explain the situation and offer a concise next action.'
  })
});

const REQUIRED_STATES = Object.freeze(['loading', 'empty', 'error', 'success', 'permission']);

export function createUxDecision({ id, journey, referenceIds, adaptation, states, proof }) {
  if (!/^[a-z][a-z0-9-]{2,63}$/.test(id || '')) throw new TypeError('A stable decision id is required');
  if (typeof journey !== 'string' || !journey.trim()) throw new TypeError('User journey is required');
  if (!Array.isArray(referenceIds) || referenceIds.length === 0 || referenceIds.some(key => !UX_REFERENCES[key])) throw new TypeError('Known references are required');
  if (typeof adaptation !== 'string' || adaptation.trim().length < 30) throw new TypeError('Document the product-specific adaptation');
  if (!Array.isArray(states) || REQUIRED_STATES.some(state => !states.includes(state))) throw new TypeError('All interaction states are required');
  if (typeof proof !== 'string' || !proof.trim()) throw new TypeError('Rendered proof is required');
  return Object.freeze({ id, journey: journey.trim(), referenceIds: Object.freeze([...referenceIds]), adaptation: adaptation.trim(), states: Object.freeze([...states]), proof: proof.trim() });
}

export { REQUIRED_STATES };
