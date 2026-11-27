const REQUIRED = ['primary','primaryContrast','secondary','accent','surface','surfaceSubtle','text','muted','border','danger','success','warning'];
const HEX = /^#[0-9a-f]{6}$/i;
const ID = /^[a-z][a-z0-9-]{1,39}$/;
function luminance(hex) { const rgb=hex.slice(1).match(/../g).map(x=>Number.parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4); return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]; }
export function contrastRatio(a,b){if(!HEX.test(a)||!HEX.test(b))throw new TypeError('Six-digit hex colors required');const [light,dark]=[luminance(a),luminance(b)].sort((x,y)=>y-x);return(light+.05)/(dark+.05);}
export function createIdentityPackage(input){
  if(!input||!ID.test(input.id??'')||!/^\d+\.\d+\.\d+$/.test(input.version??''))throw new TypeError('Identity id and semantic version required');
  const colors=Object.fromEntries(REQUIRED.map(name=>{const value=input.colors?.[name];if(!HEX.test(value??''))throw new TypeError(`Invalid color: ${name}`);return[name,value.toLowerCase()];}));
  if(contrastRatio(colors.text,colors.surface)<4.5)throw new RangeError('Text contrast below WCAG AA');
  if(contrastRatio(colors.primaryContrast,colors.primary)<4.5)throw new RangeError('Primary contrast below WCAG AA');
  return Object.freeze({id:input.id,version:input.version,colors:Object.freeze(colors)});
}
export function identityCss(identity){const pkg=createIdentityPackage(identity);const names={primary:'primary',primaryContrast:'primary-contrast',secondary:'secondary',accent:'accent',surface:'surface',surfaceSubtle:'surface-subtle',text:'text',muted:'muted',border:'border',danger:'danger',success:'success',warning:'warning'};const declarations=Object.entries(names).map(([key,name])=>`  --brand-${name}: ${pkg.colors[key]};`).join('\n');return`[data-waf-theme="${pkg.id}"] {\n${declarations}\n}\n`;}
