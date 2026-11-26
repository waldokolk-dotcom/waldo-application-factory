import { test } from 'node:test';
import assert from 'node:assert/strict';
import { boundedString, json, problem } from '../blocks/api/http.mjs';
test('bounded strings normalize safe input', () => assert.equal(boundedString('  Utrecht  '), 'Utrecht'));
test('bounded strings reject wrong types and limits', () => { for (const x of [null, '', 'x'.repeat(1001)]) assert.throws(() => boundedString(x)); });
test('responses keep success and failure status families separate', () => { assert.equal(json(200, {}).status, 200); assert.equal(problem(403, 'forbidden', 'Denied').body.type, 'urn:waf:forbidden'); assert.throws(() => json(500, {})); });
