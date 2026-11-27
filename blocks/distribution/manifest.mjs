export const distributionManifestVersion = '0.2.0';
export const updateStates = Object.freeze(['available', 'approved', 'staged', 'active', 'rolled_back']);
const semver = /^\d+\.\d+\.\d+$/;
const commit = /^[0-9a-f]{40}$/;
const actionsRun = /^https:\/\/github\.com\/[^/]+\/[^/]+\/actions\/runs\/\d+$/;
const platforms = new Set(['web', 'mobile', 'server']);

export function validateUpdate(update) {
  if (!update || typeof update !== 'object') throw new TypeError('update is required');
  for (const field of ['appId', 'blockId', 'fromVersion', 'toVersion', 'compatibility', 'targetCommit', 'evidenceRun']) if (!update[field]) throw new Error(`missing update field: ${field}`);
  if (![update.fromVersion, update.toVersion, update.rollbackVersion].every((value) => semver.test(value ?? ''))) throw new Error('versions must use semantic versioning');
  if (update.fromVersion === update.toVersion) throw new Error('update must change the version');
  if (!['patch', 'minor', 'major'].includes(update.changeType)) throw new Error('invalid changeType');
  if (!Array.isArray(update.compatibility) || !update.compatibility.length || update.compatibility.some((value) => !platforms.has(value))) throw new Error('invalid compatibility');
  if (update.rollbackVersion !== update.fromVersion) throw new Error('rollbackVersion must match the current version');
  if (!commit.test(update.targetCommit)) throw new Error('targetCommit must be a full commit SHA');
  if (!actionsRun.test(update.evidenceRun)) throw new Error('evidenceRun must be a durable GitHub Actions run URL');
  if (!Number.isInteger(update.rolloutPercent) || update.rolloutPercent < 1 || update.rolloutPercent > 100) throw new Error('rolloutPercent must be an integer from 1 through 100');
  return { ...update, compatibility: [...new Set(update.compatibility)], state: update.state ?? 'available' };
}

export function canRollout(update, app) {
  try {
    const safe = validateUpdate(update);
    const accepted = app?.acceptedBlocks?.find?.((item) => item?.id === safe.blockId && item?.version === safe.fromVersion);
    return Boolean(app?.appId === safe.appId && safe.compatibility.includes(app.platform ?? 'web') && accepted?.status === 'approved');
  } catch { return false; }
}

export function createReleaseNotice(update) {
  const safe = validateUpdate(update);
  return Object.freeze({ type:'waf-update', appId:safe.appId, blockId:safe.blockId, fromVersion:safe.fromVersion, toVersion:safe.toVersion, changeType:safe.changeType, compatibility:safe.compatibility, state:safe.state, rolloutPercent:safe.rolloutPercent, targetCommit:safe.targetCommit, evidenceRun:safe.evidenceRun, rollbackVersion:safe.rollbackVersion });
}
