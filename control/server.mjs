import {readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {timingSafeEqual} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);
const read=path=>readFile(new URL(path,root),'utf8');
export function authorized(header,password){
 if(!password || password.length<24 || typeof header!=='string') return false;
 const expected=Buffer.from('Basic '+Buffer.from('owner:'+password).toString('base64'));
 const actual=Buffer.from(header);
 return expected.length===actual.length && timingSafeEqual(expected,actual);
}
export function createControlServer(password){
 if(typeof password!=='string'||password.length<24) throw Error('WAF_OWNER_PASSWORD must be at least 24 characters');
 return createServer(async(req,res)=>{
 res.setHeader('Cache-Control','no-store');
 res.setHeader('X-Content-Type-Options','nosniff');
 res.setHeader('Content-Security-Policy',"default-src 'none'; style-src 'self'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'");
 if(!authorized(req.headers.authorization,password)){res.writeHead(401,{'WWW-Authenticate':'Basic realm="WAF", charset="UTF-8"'});return res.end('Access denied');}
 if(req.method!=='GET'){res.writeHead(405);return res.end();}
 try{
 const routes={'/':['control/index.html','text/html'],'/style.css':['control/style.css','text/css'],'/app.js':['control/app.js','text/javascript'],'/theme.css':['blocks/theme.css','text/css'],'/api/blocks':['registry/blocks.json','application/json'],'/api/apps':['registry/apps.json','application/json']};
 const route=routes[req.url];
 if(!route){res.writeHead(404);return res.end('Not found');}
 const body=await read(route[0]);res.writeHead(200,{'Content-Type':route[1]+'; charset=utf-8'});res.end(body);
 }catch{res.writeHead(500);res.end('Unavailable');}
 });
}
if(process.argv[1]===fileURLToPath(import.meta.url)) createControlServer(process.env.WAF_OWNER_PASSWORD).listen(Number(process.env.PORT||3000),'0.0.0.0');
