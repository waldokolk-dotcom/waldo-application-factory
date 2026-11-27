import {readFile,mkdir,writeFile,realpath} from 'node:fs/promises';
import {resolve,dirname,relative,isAbsolute} from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
export async function exportBlocks({appId,destination,commit,production=true}){
 if(!/^[a-f0-9]{40}$/.test(commit))throw Error('Immutable source commit required');
 const registry=JSON.parse(await readFile(resolve(root,'registry/blocks.json'),'utf8'));
 const apps=JSON.parse(await readFile(resolve(root,'registry/apps.json'),'utf8'));
 const app=apps.apps.find(a=>a.id===appId);
 if(!app)throw Error('Unknown application');
 const selected=app.blocks.map(id=>{const b=registry.blocks.find(x=>x.id===id);if(!b)throw Error('Unknown block');if(production&&(!b.productionVerified||b.status!=='production'))throw Error('Unverified block: '+id);return b;});
 const entries=[];
 for(const b of selected){const source=await realpath(resolve(root,b.path));const rel=relative(resolve(root,'blocks'),source);if(rel.startsWith('..')||isAbsolute(rel))throw Error('Invalid source');const bytes=await readFile(source);entries.push({id:b.id,version:b.version,path:'blocks/'+rel,sha256:createHash('sha256').update(bytes).digest('hex'),bytes});}
 await mkdir(destination,{recursive:false});
 for(const e of entries){const target=resolve(destination,e.path);await mkdir(dirname(target),{recursive:true});await writeFile(target,e.bytes,{flag:'wx'});}
 const manifest={schema:1,appId,source:'waldokolk-dotcom/waldo-application-factory',commit,wafVersion:registry.version,production,blocks:entries.map(({bytes,...e})=>e)};
 await writeFile(resolve(destination,'waf-lock.json'),JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});return manifest;
}
if(process.argv[1]===fileURLToPath(import.meta.url)){const [appId,destination,commit,mode]=process.argv.slice(2);if(mode!=='preview'&&mode!=='production')throw Error('Explicit mode required');await exportBlocks({appId,destination,commit,production:mode==='production'});}
