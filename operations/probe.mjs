import {checkHealth} from '../blocks/operations/monitoring.mjs';
const origin='https://open-data-coach.onrender.com';
const result=await checkHealth(origin+'/api/waf/status',{allowedOrigins:[origin],timeoutMs:10000});
console.log(JSON.stringify({app:'verbindo',checkedAt:new Date().toISOString(),...result}));
if(!result.healthy)process.exitCode=1;
