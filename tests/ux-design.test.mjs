import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createUxDecision, REQUIRED_STATES, UX_REFERENCES } from '../blocks/ux-design/patterns.mjs';

const valid = {
  id: 'verbindo-search-start',
  journey: 'Find decision-ready public data',
  referenceIds: ['mobbin-search', 'atlassian-empty'],
  adaptation: 'Use Dutch public-sector questions and preserve Verbindo branding and evidence labels.',
  states: REQUIRED_STATES,
  proof: 'tests/browser-smoke.mjs'
};

test('creates a traceable product-specific UX decision', () => {
  const decision = createUxDecision(valid);
  assert.equal(decision.referenceIds.length, 2);
  assert.match(UX_REFERENCES['mobbin-search'].url, /^https:\/\/mobbin\.com\//);
});

test('rejects unknown references and incomplete states', () => {
  assert.throws(() => createUxDecision({ ...valid, referenceIds: ['unknown'] }));
  assert.throws(() => createUxDecision({ ...valid, states: ['success'] }));
  assert.throws(() => createUxDecision({ ...valid, proof: '' }));
});
