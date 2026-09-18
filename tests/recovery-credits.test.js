import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { creditStore } from '../src/lib/server/recovery-credits.js';

test('credits persist across store instances, debit before generation, and refund failures once', () => {
 const directory = mkdtempSync(join(tmpdir(),'archweekend-credits-test-'));
 try {
  const env = { RECOVERY_CREDITS_DIR: directory, RECOVERY_SANDBOX_CREDITS:'100' };
  const first = creditStore(env);
  assert.equal(first.balance('test@example.com'),100);
  const text = first.reserve('test@example.com',1);
  assert.ok(text);
  text.commit(); text.refund();
  assert.equal(first.balance('test@example.com'),99);
  const second = creditStore(env);
  const failed = second.reserve('TEST@example.com',5);
  assert.ok(failed);
  assert.equal(first.balance('test@example.com'),94);
  failed.refund(); failed.refund();
  assert.equal(second.balance('test@example.com'),99);
  assert.equal(second.balance('other@example.com'),100);
  for (let i=0;i<19;i++) { const r=second.reserve('test@example.com',5); assert.ok(r); r.commit(); }
  assert.equal(first.reserve('test@example.com',5),null);
  assert.equal(first.balance('test@example.com'),4);
  assert.deepEqual(first.usage('test@example.com'),{allocated:100,used:96,remaining:4});
  assert.deepEqual(creditStore({...env,RECOVERY_SANDBOX_CREDITS:'50'}).usage('test@example.com'),{allocated:50,used:96,remaining:0});
  assert.throws(()=>first.reserve('test@example.com',-5));
  const file=readdirSync(directory).find(x=>x.endsWith('.json'));
  assert.ok(file);
  writeFileSync(join(directory,file),'corrupt');
  assert.throws(()=>first.balance('test@example.com'));
 } finally { rmSync(directory,{recursive:true,force:true}); }
});
test('credit storage fails closed without persistent directory configuration', () => {
 const store=creditStore({});
 assert.equal(store.ready,false);
 assert.throws(()=>store.balance('test@example.com'));
});
