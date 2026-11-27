export const changeControlVersion = '0.1.0';
export const changeStates = Object.freeze(['draft','review','approved','published','rolled_back']);

export function createChange(input) {
  if (!input?.appId || !input?.summary) throw new Error('appId and summary are required');
  return {
    changeId: input.changeId ?? `chg_${Date.now()}`,
    appId: input.appId,
    summary: input.summary,
    state: 'draft',
    changedFiles: input.changedFiles ?? [],
    changedBlocks: input.changedBlocks ?? [],
    evidence: { previewUrl:null, screenshots:[], uxReview:null, laptopReview:null, accessibilityReview:null, tests:[] },
    approval: { required:true, approvedBy:null, approvedAt:null },
    rollback: { targetVersion: input.rollbackVersion ?? null, verified:false }
  };
}
export function canPublish(change) {
  return Boolean(change?.state === 'approved' && change.approval?.approvedBy && change.evidence?.previewUrl && change.evidence?.screenshots?.length && change.evidence?.tests?.length && change.rollback?.targetVersion);
}
export function approveChange(change, actor) {
  if (!actor) throw new Error('approval actor is required');
  if (!change.evidence?.previewUrl || !change.evidence?.screenshots?.length || !change.evidence?.tests?.length) throw new Error('evidence incomplete');
  return {...change,state:'approved',approval:{required:true,approvedBy:actor,approvedAt:new Date().toISOString()}};
}