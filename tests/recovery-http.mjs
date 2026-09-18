// Integration test against a built adapter-node server. No real API requests.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
import { accessConfig, createSession, SESSION_COOKIE, SESSION_SECONDS } from '../src/lib/server/recordings-access.js';
const directory=mkdtempSync(join(tmpdir(),'archweekend-http-test-'));
const origin='http://127.0.0.1:5198';
const env={...process.env, HOST:'127.0.0.1',PORT:'5198',ORIGIN:origin,DB_URL:'',TOGETHER_API_KEY:'test-only', RECOVERY_ACCESS_ENABLED:'true',RECOVERY_PASSWORD:'example-password',RECOVERY_SESSION_SECRET:'x'.repeat(64),RECOVERY_ALLOWED_EMAILS:'test@example.com',RECOVERY_SANDBOX_CREDITS:'100',RECOVERY_CREDITS_DIR:directory};
const server=spawn(process.execPath,['--import','./tests/mock-provider.mjs','build/index.js'],{env,stdio:'ignore'});
async function login(email,password,requestOrigin=origin) {
 return fetch(origin+'/api/user/signin',{method:'POST',headers:{origin:requestOrigin},body:new URLSearchParams({email,password}),redirect:'manual'});
}
try {
 let ready=false;
 for(let i=0;i<80;i++) { try { const r=await fetch(origin+'/user/signin');if(r.ok){ready=true;break;} } catch {} await new Promise(r=>setTimeout(r,100)); }
 assert.ok(ready,'server starts without DB_URL');
 for (const path of ['/course','/course/__data.json','/ai-sandbox']) {
  const r=await fetch(origin+path,{redirect:'manual'});
  if(path.endsWith('__data.json')) { const data=await r.json(); assert.equal(data.type,'redirect');assert.equal(data.location,'/user/signin'); }
  else {assert.ok([303,307].includes(r.status),`${path}: ${r.status}`);assert.equal(r.headers.get('location'),'/user/signin');assert.ok(!(await r.text()).includes('player.mux.com'));}
 }
 assert.equal((await login('test@example.com','example-password','https://evil.example')).status,403);
 assert.equal((await login('test@example.com','wrong')).status,401);
 assert.equal((await login('unknown@example.com','example-password')).status,401);
 const r=await login(' TEST@EXAMPLE.COM ','example-password');assert.equal(r.status,200);
 const cookie=r.headers.getSetCookie().find(x=>x.startsWith(SESSION_COOKIE+'='));assert.ok(cookie);assert.match(cookie,/HttpOnly/i);assert.match(cookie,/SameSite=Lax/i);
 const auth=cookie.split(';')[0];
 const course=await fetch(origin+'/course',{headers:{cookie:auth}});assert.equal(course.status,200);assert.match(course.headers.get('cache-control'),/no-store/);assert.ok((await course.text()).includes('player.mux.com'));
 const sandbox=await fetch(origin+'/ai-sandbox',{headers:{cookie:auth}});assert.equal(sandbox.status,200);assert.match(await sandbox.text(),/100/);
 async function generate(mode,prompt='hello') { return fetch(origin+'/api/ai/sandbox',{method:'POST',headers:{origin,cookie:auth,'content-type':'application/json'},body:JSON.stringify({mode,prompt})}); }
 assert.equal((await (await generate('text')).json()).credits,99);
 assert.equal((await (await generate('image')).json()).credits,94);
 assert.equal((await generate('image','FAIL_TEST')).status,500);
 assert.equal((await (await generate('text')).json()).credits,93);
 const concurrent=await Promise.all(Array.from({length:20},()=>generate('image')));
 assert.equal(concurrent.filter(x=>x.ok).length,18);assert.equal(concurrent.filter(x=>x.status===402).length,2);
 assert.equal((await (await generate('text')).json()).credits,2);
 assert.equal((await fetch(origin+'/api/ai/sandbox',{method:'POST',headers:{origin,'content-type':'application/json'},body:'{}'})).status,401);
 const expired=createSession(accessConfig(env),'test@example.com',Date.now()-(SESSION_SECONDS+1)*1000);
 for(const value of [auth+'tampered', SESSION_COOKIE+'='+expired]) {const denied=await fetch(origin+'/course',{headers:{cookie:value},redirect:'manual'});assert.equal(denied.status,303);}
 const logout=await fetch(origin+'/api/user/signout',{method:'POST',headers:{origin,cookie:auth}});assert.equal(logout.status,200);assert.ok(logout.headers.getSetCookie().some(x=>x.startsWith(SESSION_COOKIE+'=')&&/Max-Age=0/i.test(x)));
 for(let i=0;i<10;i++) assert.equal((await login('test@example.com','wrong')).status,401);
 assert.equal((await login('test@example.com','wrong')).status,429);
 console.log('PASS: login, allowlist, cookies, recordings/data guards, sandbox, text/image debit, error refund, concurrent budget, logout, expiry, tampering and rate limiting. No paid requests.');
} finally { const exit=once(server,'exit'); server.kill('SIGTERM');await exit;rmSync(directory,{recursive:true,force:true}); }
