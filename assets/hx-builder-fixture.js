/* Backend-owned synthetic response snapshots. Never computes a recipe in the browser. */
export async function createFixture(base) {
  const bundle = /\.json(?:\?|$)/.test(base) ? await fetch(base).then(r => { if (!r.ok) throw Error('configuration'); return r.json(); }) : null;
  const read = name => bundle ? Promise.resolve(bundle[name]) : fetch(`${base}/${name}.json`, {cache:'no-store'}).then(r=>{if(!r.ok)throw Error('configuration');return r.json();});
  const names=['energy','digestion','thyroid','clarification','foundation','stopped','conflict','injection','edit','invalid-edit'];
  const catalog=await read('catalog');
  const pairs=await Promise.all(names.map(async name=>({name,request:await read(`${name}-request`),response:await read(`${name}-response`)})));
  const canonical = value => {
    if(Array.isArray(value))return value.map(canonical).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
    if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])]));
    return value;
  };
  return async (operation,input,signal)=>{
    if(signal?.aborted)throw new DOMException('Aborted','AbortError');
    if(operation==='catalog')return structuredClone(catalog);
    const pair=pairs.find(p=>(operation==='validate')===p.name.includes('edit') && JSON.stringify(canonical(p.request))===JSON.stringify(canonical(input)));
    if(pair)return structuredClone(pair.response);
    return {schema_version:'1',request_id:'fixture-not-recorded',status:'unavailable',build:null,display:null,notes:[{code:'fixture_only',text:'This combination is not recorded in fixture mode. Use the connected local preview to explore other choices. The recorded Energy example uses no written goal or conditions, Mango, and Standard strength.'}],errors:[],clarification:null,foundation_url:null,pricing:null,availability:null,purchase:{enabled:false,reason_code:'review_only'}};
  };
}

