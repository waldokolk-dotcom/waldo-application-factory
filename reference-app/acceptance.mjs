import {createHash} from 'node:crypto';
import {openIncident,recordIncident} from '../blocks/operations/incident.mjs';
import {createRecoveryPlan,canRecover} from '../blocks/operations/recovery.mjs';
import {evaluateSecurityScan} from '../blocks/operations/security-ops.mjs';
import {verifyRestoreDrill} from '../blocks/operations/backup.mjs';
import {evaluateCost} from '../blocks/operations/cost-control.mjs';
import {createTicket,ticketForOwner} from '../blocks/operations/support.mjs';
import {triageFeedback} from '../blocks/operations/feedback.mjs';
import {evaluateImprovement} from '../blocks/operations/improvement.mjs';
import {createArticle} from '../blocks/operations/knowledge.mjs';
import {canNotify,notificationReceipt} from '../blocks/operations/notifications.mjs';
import {createOpsReport} from '../blocks/operations/ops-reporting.mjs';
import {validateUpdate,canRollout,createReleaseNotice} from '../blocks/distribution/manifest.mjs';
import {createChange,attachEvidence,approveChange,canPublish} from '../blocks/change-control/manifest.mjs';

const owner='11111111-1111-4111-8111-111111111111';
const other='22222222-2222-4222-8222-222222222222';
const blocks=['incident','recovery','support','feedback','improvement','security-ops','backup','cost-control','knowledge','notifications','ops-reporting','distribution','change-control'];
const expectReject=(fn)=>{try{fn();return false;}catch{return true;}};

export function runAcceptance({commit,runUrl,origin,now=new Date().toISOString()}) {
  if(!/^[a-f0-9]{40}$/.test(commit??'')) throw new Error('exact deployment commit unavailable');
  const created=new Date(Date.parse(now)-1000).toISOString();
  const evidence=`${origin}/acceptance`;
  const results={};

  let incident=openIncident({id:'inc-reference',severity:'sev2',summary:'Synthetic health probe failure',detectedAt:created,service:'waf-reference'});
  const unresolvedReject=expectReject(()=>recordIncident(incident,{type:'resolved',at:now,actor:'operator',evidence}));
  const activeIncident=recordIncident(incident,{type:'acknowledged',at:now,actor:'operator',evidence});
  incident=recordIncident(activeIncident,{type:'mitigated',at:now,actor:'operator',evidence});
  incident=recordIncident(incident,{type:'resolved',at:now,actor:'operator',evidence});
  results.incident=incident.state==='resolved'&&unresolvedReject;

  const recovery=createRecoveryPlan({incidentId:activeIncident.id,currentCommit:commit,targetCommit:'0'.repeat(40),actions:['stop-rollout','deploy-target','verify-health','verify-security'],approvedBy:'Waldo Operator',approvedAt:now});
  results.recovery=canRecover(recovery,activeIncident)&&!canRecover(recovery,{...activeIncident,id:'wrong'});
  results['security-ops']=evaluateSecurityScan({commit,runUrl,scannedAt:now,critical:0,high:0,accessReview:'pass'}).passed&&!evaluateSecurityScan({commit,runUrl,scannedAt:now,critical:0,high:1,accessReview:'pass'}).passed;

  const rows=Object.freeze([{id:1,value:'isolated'},{id:2,value:'restore'}]);
  const checksum=createHash('sha256').update(JSON.stringify(rows)).digest('hex');
  results.backup=verifyRestoreDrill({backupId:'backup-reference',createdAt:created,restoredAt:now,sourceCount:rows.length,restoredCount:structuredClone(rows).length,checksum,isolated:true}).verified&&expectReject(()=>verifyRestoreDrill({backupId:'backup-reference',createdAt:created,restoredAt:now,sourceCount:2,restoredCount:2,checksum,isolated:false}));
  results['cost-control']=evaluateCost({newCommitmentCents:0,monthlyLimitCents:0,currentSpendCents:0,quotaUsed:1,quotaLimit:100}).passed&&!evaluateCost({newCommitmentCents:1,monthlyLimitCents:1,currentSpendCents:1,quotaUsed:1,quotaLimit:100}).passed;

  const ticket=createTicket({id:'sup-reference',ownerId:owner,category:'account',message:'Synthetic account recovery verification',createdAt:now});
  results.support=ticketForOwner(ticket,owner)===ticket&&expectReject(()=>ticketForOwner(ticket,other));
  results.feedback=triageFeedback({id:'fb-reference',product:'waf-reference',journey:'release acceptance',rating:2,comment:'Synthetic priority verification',createdAt:now}).priority==='high'&&expectReject(()=>triageFeedback({id:'fb-secret',product:'waf-reference',journey:'release',rating:3,comment:'https://x.test?a=1&token=secret',createdAt:now}));
  results.improvement=evaluateImprovement({id:'imp-reference',metric:'accepted-contracts',before:12,after:13,evidenceUrl:runUrl,commit,measuredAt:now}).improved;
  results.knowledge=createArticle({id:'kb-reference',title:'Reference operations',version:'1.0.0',body:'This runbook describes isolated acceptance and safe rollback verification.',sourceUrls:[evidence],reviewedAt:now}).version==='1.0.0';
  results.notifications=canNotify({verified:true,updates:true,frequency:'weekly',channel:'email',event:'release'})&&!canNotify({verified:true,updates:false,frequency:'weekly',channel:'email',event:'release'})&&!notificationReceipt({userId:owner,event:'release',providerStatus:'transport-unconfirmed',sentAt:now}).delivered;
  results['ops-reporting']=createOpsReport({app:'waf-reference',commit,generatedAt:now,maxAgeMinutes:5,measurements:[{id:'health',status:'pass',measuredAt:now,evidence:`${origin}/health`}]}).healthy&&!createOpsReport({app:'waf-reference',commit,generatedAt:now,maxAgeMinutes:5,measurements:[{id:'health',status:'unknown',measuredAt:now,evidence:`${origin}/health`}]}).healthy;

  const update=validateUpdate({appId:'waf-reference',blockId:'api',fromVersion:'0.1.0',toVersion:'0.2.0',changeType:'minor',compatibility:['web'],rollbackVersion:'0.1.0',targetCommit:commit,evidenceRun:runUrl,rolloutPercent:10});
  const app={appId:'waf-reference',platform:'web',acceptedBlocks:[{id:'api',version:'0.1.0',status:'approved'}]};
  results.distribution=canRollout(update,app)&&createReleaseNotice(update).rolloutPercent===10&&!canRollout({...update,rolloutPercent:0},app);
  let change=createChange({appId:'waf-reference',summary:'Reference operations acceptance',targetCommit:commit,rollbackVersion:'0.1.0'});
  change=attachEvidence(change,{previewUrl:origin,screenshots:[`${origin}/artifacts/before.svg`,`${origin}/artifacts/after.svg`],qualityRun:runUrl,uxReview:'pass',laptopReview:'pass',accessibilityReview:'pass'},true);
  change=approveChange(change,'Waldo Operator',now);
  results['change-control']=canPublish(change)&&expectReject(()=>attachEvidence(change,{},false));

  return Object.freeze({schema:1,app:'waf-reference',commit,generatedAt:now,isolated:true,blocks:Object.fromEntries(blocks.map(id=>[id,{version:id==='distribution'||id==='change-control'?'0.2.0':'0.1.0',passed:results[id]===true}])),passed:blocks.every(id=>results[id]===true)});
}
