export const changeControlVersion = '0.2.0';
export const changeStates = Object.freeze(['draft', 'review', 'approved', 'published', 'rolled_back']);
const commit = /^[0-9a-f]{40}$/;
const semver = /^\d+\.\d+\.\d+$/;
const actionsRun = /^https:\/\/github\.com\/[^/]+\/[^/]+\/actions\/runs\/\d+$/;
function httpsUrl(value) { try { return new URL(value).protocol === 'https:'; } catch { return false; } }
function evidenceComplete(change) {
  const e = change?.evidence;
  return Boolean(commit.test(change?.targetCommit ?? '') && httpsUrl(e?.previewUrl) && Array.isArray(e?.screenshots) && e.screenshots.length >= 2 && e.screenshots.every(httpsUrl) && actionsRun.test(e?.qualityRun ?? '') && e?.uxReview === 'pass' && e?.laptopReview === 'pass' && e?.accessibilityReview === 'pass' && change?.rollback?.verified === true && semver.test(change?.rollback?.targetVersion ?? ''));
}
export function createChange(input) {
  if (!input?.appId || !input?.summary) throw new Error('appId and summary are required');
  if (!commit.test(input.targetCommit ?? '')) throw new Error('targetCommit must be a full commit SHA');
  if (!semver.test(input.rollbackVersion ?? '')) throw new Error('rollbackVersion must use semantic versioning');
  return { changeId:input.changeId ?? `chg_${Date.now()}`, appId:input.appId, summary:input.summary, targetCommit:input.targetCommit, state:'draft', changedFiles:input.changedFiles ?? [], changedBlocks:input.changedBlocks ?? [], evidence:{previewUrl:null,screenshots:[],qualityRun:null,uxReview:null,laptopReview:null,accessibilityReview:null}, approval:{required:true,approvedBy:null,approvedAt:null}, rollback:{targetVersion:input.rollbackVersion,verified:false} };
}
export function attachEvidence(change, evidence, rollbackVerified = false) {
  if (!change || change.state !== 'draft') throw new Error('only draft changes accept evidence');
  const candidate = { ...change, state:'review', evidence:structuredClone(evidence), rollback:{...change.rollback,verified:rollbackVerified} };
  if (!evidenceComplete(candidate)) throw new Error('evidence incomplete or invalid');
  return candidate;
}
export function approveChange(change, actor, approvedAt = new Date().toISOString()) {
  if (!actor?.trim()) throw new Error('approval actor is required');
  if (change?.state !== 'review' || !evidenceComplete(change)) throw new Error('evidence incomplete or change is not in review');
  if (Number.isNaN(Date.parse(approvedAt))) throw new Error('approval timestamp is invalid');
  return { ...change, state:'approved', approval:{required:true,approvedBy:actor.trim(),approvedAt} };
}
export function canPublish(change) { return Boolean(change?.state === 'approved' && change.approval?.approvedBy && !Number.isNaN(Date.parse(change.approval?.approvedAt)) && evidenceComplete(change)); }
