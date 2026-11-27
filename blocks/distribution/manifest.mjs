export const distributionManifestVersion = '0.1.0';

export const updateStates = Object.freeze(['available','approved','staged','active','rolled_back']);

export function validateUpdate(update) {
  if (!update || typeof update !== 'object') throw new TypeError('update is required');
  for (const field of ['appId','blockId','fromVersion','toVersion','compatibility']) {
    if (!update[field]) throw new Error(`missing update field: ${field}`);
  }
  if (!['patch','minor','major'].includes(update.changeType)) throw new Error('invalid changeType');
  if (!update.rollbackVersion) throw new Error('rollbackVersion is required');
  return { ...update, state: update.state ?? 'available' };
}

export function canRollout(update, app) {
  return Boolean(update && app && update.compatibility.includes(app.platform ?? 'web') && app.acceptedBlocks?.includes(update.blockId));
}

export function createReleaseNotice(update) {
  const safe = validateUpdate(update);
  return { type:'waf-update', appId:safe.appId, blockId:safe.blockId, fromVersion:safe.fromVersion, toVersion:safe.toVersion, from:safe.fromVersion, to:safe.toVersion, state:safe.state, rollbackVersion:safe.rollbackVersion };
}
