const DEFAULT_LIMIT=1024*1024;
function targetUrl(value,allowedOrigins){
  const url=new URL(value);
  if(url.protocol!=='https:'||url.username||url.password||!allowedOrigins?.includes(url.origin))throw new TypeError('API target not allowed');
  return url;
}
export async function fetchJson(url,{allowedOrigins,method='GET',headers={},body,timeoutMs=10000,maxBytes=DEFAULT_LIMIT,fetcher=fetch}={}){
  const target=targetUrl(url,allowedOrigins);
  if(!['GET','HEAD','POST','PUT','PATCH','DELETE'].includes(method)||!Number.isInteger(timeoutMs)||timeoutMs<100||timeoutMs>30000||!Number.isInteger(maxBytes)||maxBytes<1||maxBytes>5*1024*1024)throw new TypeError('Invalid connector options');
  const safeHeaders=new Headers(headers);safeHeaders.set('accept','application/json');
  safeHeaders.delete('authorization');safeHeaders.delete('cookie');safeHeaders.delete('proxy-authorization');
  const response=await fetcher(target,{method,headers:safeHeaders,body,redirect:'error',signal:AbortSignal.timeout(timeoutMs)});
  const type=(response.headers.get('content-type')||'').toLowerCase();
  if(!response.ok)throw Object.assign(new Error('Upstream rejected request'),{status:502,upstreamStatus:response.status});
  if(!/^application\/(?:[a-z0-9.+-]+\+)?json(?:;|$)/.test(type))throw Object.assign(new Error('Upstream did not return JSON'),{status:502});
  const declared=Number(response.headers.get('content-length'));
  if(Number.isFinite(declared)&&declared>maxBytes)throw Object.assign(new Error('Upstream response too large'),{status:502});
  const buffer=await response.arrayBuffer();
  if(buffer.byteLength>maxBytes)throw Object.assign(new Error('Upstream response too large'),{status:502});
  try{return JSON.parse(new TextDecoder().decode(buffer));}catch{throw Object.assign(new Error('Upstream returned invalid JSON'),{status:502});}
}
