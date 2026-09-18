import { createHash, randomUUID } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, renameSync, rmdirSync } from 'node:fs';
import { join, isAbsolute } from 'node:path';

/** @param {Record<string, string | undefined>} env */
export function creditStore(env) {
 const directory = env.RECOVERY_CREDITS_DIR || '';
 const allowance = Number(env.RECOVERY_SANDBOX_CREDITS ?? 100);
 const ready = isAbsolute(directory) && Number.isSafeInteger(allowance) && allowance >= 0;
 /** @param {string} email */
 function file(email) {
  if (!ready) throw new Error('Persistent credit storage is not configured');
  return join(directory, createHash('sha256').update(email.trim().toLowerCase()).digest('hex')+'.json');
 }
 /** @param {string} path */
 function spent(path) {
  try {
   const value = JSON.parse(readFileSync(path,'utf8'));
   if (value.version !== 1 || !Number.isSafeInteger(value.spent) || value.spent < 0) throw new Error('Invalid credit ledger');
   return value.spent;
  } catch (err) {
   if (err && typeof err === 'object' && 'code' in err && err.code === 'ENOENT') return 0;
   throw err;
  }
 }
 /** @param {string} email @param {number} amount */
 function change(email, amount) {
  const path = file(email);
  mkdirSync(directory,{recursive:true,mode:0o700});
  // A short filesystem lock serializes reservations/refunds across processes.
  // Never remove a lock automatically: a crash must fail closed until reviewed.
  mkdirSync(path+'.lock', {mode:0o700});
  try {
   const used = spent(path);
   if (amount > 0 && allowance-used < amount) return false;
   const next = Math.max(0,used+amount);
   const tmp = path+'.'+randomUUID()+'.tmp';
   writeFileSync(tmp,JSON.stringify({version:1,spent:next}),{mode:0o600});
   renameSync(tmp,path);
   return true;
  } finally { rmdirSync(path+'.lock'); }
 }
 return {
  ready,
  /** @param {string} email */
  usage(email) {
   const used = spent(file(email));
   return { allocated: allowance, used, remaining: Math.max(0,allowance-used) };
  },
  /** @param {string} email */
  balance(email) { return Math.max(0,allowance-spent(file(email))); },
  /** Reserve before calling a paid provider; failed requests are refunded.
   * @param {string} email @param {number} amount */
  reserve(email,amount) {
   if (!Number.isSafeInteger(amount) || amount <= 0) throw new Error('Invalid credit cost');
   if (!change(email,amount)) return null;
   let settled=false;
   return {
    commit() { settled=true; },
    refund() { if (!settled) { change(email,-amount); settled=true; } },
    balance: () => Math.max(0,allowance-spent(file(email)))
   };
  }
 };
}
