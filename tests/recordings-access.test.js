import { test } from 'node:test';
import assert from 'node:assert/strict';
import { accessConfig, canSignIn, createSession, readSession, createLoginLimiter, SESSION_SECONDS } from '../src/lib/server/recordings-access.js';

const settings = {
 RECOVERY_ACCESS_ENABLED: 'true', RECOVERY_PASSWORD: 'example-password',
 RECOVERY_SESSION_SECRET: 'a'.repeat(64),
 RECOVERY_ALLOWED_EMAILS: 'Test@example.com, test@example.com;other@example.com'
};
const config = accessConfig(settings);
const now = 1800000000000;

test('allowlist normalizes case and whitespace, rejects unlisted emails and wrong passwords', () => {
 assert.equal(config.emails.size, 2);
 assert.equal(canSignIn(config, ' TEST@EXAMPLE.COM ', 'example-password'), true);
 assert.equal(canSignIn(config, 'unknown@example.com', 'example-password'), false);
 assert.equal(canSignIn(config, 'test@example.com', 'incorrect'), false);
});
test('disabled or incomplete configuration fails closed', () => {
 for (const patch of [{RECOVERY_ACCESS_ENABLED:'false'}, {RECOVERY_SESSION_SECRET:''}, {RECOVERY_PASSWORD:''}, {RECOVERY_ALLOWED_EMAILS:''}]) {
  const c = accessConfig({...settings,...patch});
  assert.equal(canSignIn(c, 'test@example.com', 'example-password'), false);
  assert.equal(readSession(c, createSession(config,'test@example.com',now),now), undefined);
 }
});
test('signed sessions expire and cannot be modified or used after removing an email', () => {
 const token = createSession(config,'Test@example.com',now);
 const session = readSession(config,token,now);
 assert.ok(session);
 assert.equal(session.email,'test@example.com');
 assert.equal(session.access,'recovery');
 assert.equal(readSession(config,token,now + SESSION_SECONDS*1000),undefined);
 const [body,mac] = token.split('.');
 const forged = Buffer.from(JSON.stringify({...JSON.parse(Buffer.from(body,'base64url').toString('utf8')),email:'unknown@example.com'})).toString('base64url');
 for (const bad of [forged+'.'+mac, token+'x', token+'.extra', 'invalid', 'x'.repeat(3000)]) assert.equal(readSession(config,bad,now),undefined);
 assert.equal(readSession({...config,emails:new Set()},token,now),undefined);
 assert.equal(readSession({...config,secret:'b'.repeat(64)},token,now),undefined);
 assert.equal(readSession({...config,password:'rotated-password'},token,now),undefined);
});
test('limiter blocks repeated attempts, expires and bounds address storage', () => {
 const limiter = createLoginLimiter(2,1000,1);
 assert.equal(limiter.consume('client',0),0);
 assert.equal(limiter.consume('client',0),0);
 assert.equal(limiter.consume('client',0),1);
 assert.equal(limiter.consume('another',0),1);
 assert.equal(limiter.consume('another',1001),0);
 limiter.clear('another');
 assert.equal(limiter.consume('client',1002),0);
});
