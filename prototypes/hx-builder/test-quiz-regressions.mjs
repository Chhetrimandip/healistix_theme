import assert from 'node:assert/strict';
import {test} from 'node:test';
globalThis.document={querySelectorAll:()=>[]};
const {Builder}=await import('../../assets/hx-builder-app.js');
function ui(){
 const b=Object.create(Builder.prototype);
 Object.assign(b,{q:{goal_text:'',use_chips:[],customer:{allergies:'zymoglyphic pollen'},flavor_pref:{family:'none',id:'none',level:'standard'}},catalog:{uses:[],flavors:['none','banana','mango'],limits:{max_herbs:4}},root:{querySelector:()=>null},step:'goals',render(){},focus(){},showError(message){this.error=message;},go(step){this.step=step;}});
 return b;
}
test('empty goals stay on goals with actionable guidance',()=>{const b=ui();b.next();assert.equal(b.step,'goals');assert.match(b.error,/goal/i);});
test('written goal may continue without a chip',()=>{const b=ui();b.q.goal_text='Everyday energy';b.next();assert.equal(b.step,'gates');});
test('family selection requires an explicit flavor',()=>{const b=ui();b.step='flavor';b.change({target:{name:'family',value:'tropical'}});assert.equal(b.q.flavor_pref.id,'');b.next();assert.equal(b.step,'flavor');assert.match(b.error,/flavor/i);});
test('unflavored has only one selectable radio',()=>{const b=ui();b.step='flavor';assert.equal((b.question().match(/value="none"/g)||[]).length,1);});
test('unresolved allergy offers specific guidance without retry loop',()=>{const b=ui();b.step='unavailable';b.response={errors:[{code:'ALLERGY_UNRESOLVED',message:'These choices need confirmation before a blend can be offered.'}]};const html=b.statusView();assert.match(html,/allergy/i);assert.match(html,/data-action="edit-suitability"/);assert.doesNotMatch(html,/data-action="retry"/);assert.doesNotMatch(html,/zymoglyphic/);});
test('fifth herb is rejected before a request with clear error and existing recipe preserved',async()=>{const b=ui();b.result={build:{herbs:[1,2,3,4]}};const prior=b.result;b.api=()=>assert.fail('must not send invalid count');await b.submit({herbs:[1,2,3,4,5]});assert.equal(b.result,prior);assert.match(b.error,/up to 4 herbs/);});
test('goal selection persists and deselects through change events',()=>{const b=ui();let checked=[{value:'energy'}];b.root.querySelectorAll=()=>checked;b.change({target:{name:'use_chips',value:'energy',checked:true}});assert.deepEqual(b.q.use_chips,['energy']);checked=[];b.change({target:{name:'use_chips',value:'energy',checked:false}});assert.deepEqual(b.q.use_chips,[]);});
