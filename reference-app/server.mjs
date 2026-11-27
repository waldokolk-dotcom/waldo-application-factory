import {createServer} from 'node:http';
import {runAcceptance} from './acceptance.mjs';

const port=Number(process.env.PORT??3000);
const commit=process.env.RENDER_GIT_COMMIT??process.env.WAF_COMMIT;
const runUrl=process.env.WAF_EVIDENCE_RUN;
const json=(res,status,body)=>{res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'});res.end(JSON.stringify(body));};
const svg=(res,label,color)=>{res.writeHead(200,{'content-type':'image/svg+xml','cache-control':'public, max-age=3600','x-content-type-options':'nosniff'});res.end(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" role="img" aria-label="${label}"><rect width="100%" height="100%" fill="${color}"/><text x="50%" y="50%" text-anchor="middle" fill="white" font-family="sans-serif" font-size="42">${label}</text></svg>`);};

createServer((req,res)=>{
  const origin=`https://${req.headers.host}`;
  if(req.method!=='GET'&&req.method!=='HEAD') return json(res,405,{error:'method_not_allowed'});
  if(req.url==='/health') return json(res,200,{healthy:true,app:'waf-reference',commit});
  if(req.url==='/artifacts/before.svg') return svg(res,'Before acceptance','#334155');
  if(req.url==='/artifacts/after.svg') return svg(res,'After acceptance','#166534');
  if(req.url==='/acceptance'||req.url==='/status') {
    try { const report=runAcceptance({commit,runUrl,origin}); return json(res,report.passed?200:503,report); }
    catch(error) { return json(res,503,{healthy:false,error:'acceptance_unavailable',detail:error.message}); }
  }
  return json(res,404,{error:'not_found'});
}).listen(port,'0.0.0.0');
