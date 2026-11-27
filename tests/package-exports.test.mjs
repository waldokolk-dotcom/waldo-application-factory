import test from 'node:test';
import assert from 'node:assert/strict';

const exportedModules = [
  'auth', 'data', 'data/migration', 'theme', 'api', 'api/connector',
  'api/openapi', 'ux-design', 'quality', 'release', 'distribution',
  'change-control', 'monitoring', 'incident', 'recovery', 'security-ops',
  'backup', 'cost-control', 'support', 'feedback', 'improvement', 'knowledge',
  'notifications', 'ops-reporting'
];

test('alle geselecteerde JavaScript-bouwblokken zijn package-exports', async () => {
  for (const moduleName of exportedModules) {
    const module = await import(`@waldokolk/waf-core/${moduleName}`);
    assert.ok(Object.keys(module).length > 0, `${moduleName} heeft exports nodig`);
  }
});
