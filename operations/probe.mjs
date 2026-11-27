import {checkHealth} from '../blocks/operations/monitoring.mjs';
const targets=[{app:'verbindo',url:'https://open-data-coach.onrender.com/api/waf/status',scope:'status endpoint'},{app:'pootgenoten',url:'https://pootgenoten.waldokolk.chatgpt.site/',scope:'public page only'}];
await Promise.all(targets.map(async ({app,url,scope})=>{
 const options={allowedOrigins:[new URL(url).origin],timeoutMs:10000};
 const attempts=[];
 for(let i=0;i<3;i++){const result=await checkHealth(url,options);attempts.push(result);if(result.healthy)break;}
 const healthy=attempts.at(-1).healthy;
 console.log(JSON.stringify({app,scope,checkedAt:new Date().toISOString(),healthy,attempts}));
 if(!healthy)process.exitCode=1;
}));
