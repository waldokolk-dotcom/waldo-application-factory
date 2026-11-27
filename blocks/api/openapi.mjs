const METHOD=new Set(['get','post','put','patch','delete','head','options']);
export function validateOpenApi(document){
  if(!document||typeof document!=='object'||!/^3\.1\.\d+$/.test(document.openapi??'')||typeof document.info?.title!=='string'||!/^\d+\.\d+\.\d+$/.test(document.info?.version??'')||!document.paths||typeof document.paths!=='object')throw new TypeError('Invalid OpenAPI 3.1 document');
  for(const [path,item] of Object.entries(document.paths)){
    if(!path.startsWith('/')||!item||typeof item!=='object')throw new TypeError('Invalid OpenAPI path');
    for(const [method,operation] of Object.entries(item))if(METHOD.has(method)){
      if(!operation||typeof operation!=='object'||typeof operation.operationId!=='string'||!operation.responses||typeof operation.responses!=='object'||!Object.keys(operation.responses).some(code=>/^2\d\d$/.test(code)))throw new TypeError('Invalid OpenAPI operation');
    }
  }
  return Object.freeze(document);
}
export function createOpenApi({title,version,paths}){return validateOpenApi({openapi:'3.1.0',info:{title,version},paths});}
