import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import {createTestOrder} from '../../assets/hx-builder-test-order.js';
const fixture = JSON.parse(await readFile(new URL('./fixtures/energy-response.json',import.meta.url)));
const copy = () => structuredClone(fixture);

test('uses exact server jar and premium prices for every jar',()=>{
  const result=copy();
  const order=createTestOrder(result,3);
  assert.equal(order.unit_minor,3899);assert.equal(order.total_minor,11697);
  assert.deepEqual(order.breakdown,result.pricing.breakdown);
  assert.equal(order.tickets.length,3);assert.equal(order.mode,'simulation');
  assert.match(order.id,/^TEST-/);assert.equal(new Set(order.tickets.map(t=>t.id)).size,3);
  order.tickets[0].recipe.herbs[0].g=999;
  assert.notEqual(order.tickets[1].recipe.herbs[0].g,999);assert.deepEqual(result,fixture);
});
test('quantity limits and each ingredient stock are enforced',()=>{
  for(const value of [0,-1,26,1.5,NaN,'2',null]) assert.throws(()=>createTestOrder(copy(),value));
  assert.equal(createTestOrder(copy(),25).quantity,25);
  const stock=Object.fromEntries(fixture.build.herbs.map(h=>[h.id,3]));
  stock[fixture.build.herbs[1].id]=1;
  assert.throws(()=>createTestOrder(copy(),2,stock),/stock/);
  assert.throws(()=>createTestOrder(copy(),1,{}),/stock/);
  assert.equal(createTestOrder(copy(),1,stock).quantity,1);
});
test('rejects malformed or inconsistent money without rounding',()=>{
  for(const amount of [-1,1.2,NaN,Infinity,Number.MAX_SAFE_INTEGER+1,'3899']) {
    const r=copy();r.pricing.total_minor=amount;assert.throws(()=>createTestOrder(r,1));
  }
  const r=copy();r.pricing.breakdown[1].total_minor=401;assert.throws(()=>createTestOrder(r,1));
  const mismatch=copy();mismatch.pricing.total_minor++;assert.throws(()=>createTestOrder(mismatch,1));
  const overflow=copy();overflow.pricing.total_minor=Number.MAX_SAFE_INTEGER;assert.throws(()=>createTestOrder(overflow,2));
});
test('requires a recommendation with unique, positive recipe quantities',()=>{
  const blocked=copy();blocked.status='blocked';assert.throws(()=>createTestOrder(blocked,1));
  for(const g of [0,-1,NaN,Infinity,'3']) {const r=copy();r.build.herbs[0].g=g;assert.throws(()=>createTestOrder(r,1));}
  const repeated=copy();repeated.build.herbs.push(repeated.build.herbs[0]);assert.throws(()=>createTestOrder(repeated,1));
  const empty=copy();empty.build.herbs=[];assert.throws(()=>createTestOrder(empty,1));
});
test('projects recipe data only and leaves text inert for UI escaping',()=>{
  const r=copy();const secret='PRIVATE-HEALTH-ANSWER';
  r.customer={email:secret};r.build.uses=[secret];r.build.goals=secret;
  r.display.herbs[0].approved_phrase=secret;r.pricing.breakdown[0].customer=secret;
  r.display.herbs[0].name='<img src=x onerror=alert(1)>';
  const order=createTestOrder(r,1);
  assert.equal(JSON.stringify(order).includes(secret),false);
  assert.equal(order.recipe.herbs[0].name,'<img src=x onerror=alert(1)>');
  assert.deepEqual(Object.keys(order.recipe).sort(),['base','flavor','herbs','strength']);
  assert.equal(order.tickets[0].status,'test_request');
});
