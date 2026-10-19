import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { getCourseData } from '../src/lib/server/course-data.js';

// Run after npm run build. This server uses only the isolated credentials below.
let port;
let base;
let server;
let output = '';
before(async () => {
	const reservation = createServer();
	reservation.listen(0, '127.0.0.1');
	await once(reservation, 'listening');
	port = reservation.address().port;
	await new Promise((resolve) => reservation.close(resolve));
	base = `http://127.0.0.1:${port}`;
	server = spawn(process.execPath, ['build/index.js'], {
		env: {
			...process.env,
			HOST: '127.0.0.1',
			PORT: String(port),
			ORIGIN: base,
			DB_URL: '',
			RECOVERY_ACCESS_ENABLED: 'true',
			RECOVERY_PASSWORD: 'english-flow-test-password',
			RECOVERY_SESSION_SECRET: 'english-flow-test-secret-'.repeat(3),
			RECOVERY_ALLOWED_EMAILS: 'student@example.test'
		},
		stdio: ['ignore', 'pipe', 'pipe']
	});
	server.stdout.on('data', (chunk) => {
		output += chunk;
	});
	server.stderr.on('data', (chunk) => {
		output += chunk;
	});
	for (let attempt = 0; attempt < 100; attempt++) {
		if (server.exitCode !== null) throw new Error(`Test server exited: ${output}`);
		if (output.includes('Listening on')) return;
		await new Promise((resolve) => setTimeout(resolve, 100));
	}
	throw new Error(`Test server did not start: ${output}`);
});
after(async () => {
	if (server && server.exitCode === null) {
		const stopped = once(server, 'exit');
		server.kill('SIGTERM');
		await stopped;
	}
});

function login(password, language = 'en', origin = base) {
	return fetch(`${base}/api/user/signin`, {
		method: 'POST',
		headers: { origin, 'accept-language': language },
		body: new URLSearchParams({ email: 'student@example.test', password })
	});
}

test('English catalogue preserves all video identities, URLs, dates and topic coverage', () => {
	const ru = getCourseData('ru');
	const en = getCourseData('en');
	for (const key of ['videos', 'workshopVideos']) {
		assert.equal(en[key].length, ru[key].length);
		en[key].forEach((video, index) => {
			assert.equal(video.id, ru[key][index].id);
			assert.equal(video.url, ru[key][index].url);
			assert.equal(video.topics?.length, ru[key][index].topics?.length);
		});
	}
	assert.doesNotMatch(JSON.stringify(en), /[А-Яа-яЁё]/);
	assert.match(en.workshopVideos[0].title, /26 September/);
	assert.match(en.workshopVideos[1].title, /27 September/);
});

test('English pages, checkout return, authentication and logout stay localised and protected', async () => {
	for (const path of ['/en/user/signin', '/en/register']) {
		const response = await fetch(base + path);
		assert.equal(response.status, 200);
		const html = await response.text();
		assert.doesNotMatch(html, /[А-Яа-яЁё]/);
		assert.equal((html.match(/name="description"/g) || []).length, 1);
		assert.doesNotMatch(html, /href="\/ai-sandbox"/);
	}
	const landing = await fetch(base + '/en');
	assert.match(landing.headers.get('set-cookie') || '', /archweekend_locale=en/);
	const landingHtml = await landing.text();
	assert.match(landingHtml, /href="\/en\/user\/signin"/);
	assert.doesNotMatch(landingHtml, /href="\/ai-sandbox"/);
	const returned = await fetch(base + '/register?invoice=test', {
		redirect: 'manual',
		headers: { cookie: 'archweekend_locale=en' }
	});
	assert.equal(returned.status, 303);
	assert.equal(returned.headers.get('location'), '/en/register?invoice=test');
	assert.match(returned.headers.get('cache-control'), /no-store/);
	assert.equal((await fetch(base + '/register', { redirect: 'manual' })).status, 200);

	for (const path of ['/en/course', '/en/course/__data.json', '/en/course/nested']) {
		const response = await fetch(base + path, { redirect: 'manual' });
		if (path.endsWith('__data.json')) {
			assert.deepEqual(await response.json(), { type: 'redirect', location: '/en/user/signin' });
		} else {
			assert.equal(response.status, 303);
			assert.equal(response.headers.get('location'), '/en/user/signin');
		}
	}
	const russianProtected = await fetch(base + '/course', { redirect: 'manual' });
	assert.equal(russianProtected.headers.get('location'), '/user/signin');

	let response = await login('wrong-password', 'en', 'https://other.example');
	assert.equal(response.status, 403);
	assert.equal((await response.json()).message, 'Invalid request origin.');
	response = await login('wrong-password');
	assert.equal(response.status, 401);
	assert.equal((await response.json()).message, 'Incorrect email or password.');
	response = await login('wrong-password', 'ru');
	assert.equal((await response.json()).message, 'Неверный email или пароль.');
	response = await login('english-flow-test-password');
	assert.equal(response.status, 200);
	const token = (response.headers.get('set-cookie') || '').match(
		/archweekend_access=([^;,]+)/
	)?.[1];
	assert.ok(token, 'Sign-in returns a session cookie');
	const cookie = `archweekend_access=${token}; archweekend_locale=en`;
	response = await fetch(base + '/en/course', { headers: { cookie } });
	assert.equal(response.status, 200);
	assert.match(response.headers.get('cache-control'), /private, no-store/);
	const courseHtml = await response.text();
	assert.doesNotMatch(courseHtml, /[А-Яа-яЁё]/);
	assert.match(courseHtml, /Course recordings/);
	assert.match(courseHtml, /Recording language: Russian/);
	assert.match(courseHtml, /26 September/);
	assert.equal((courseHtml.match(/<iframe/g) || []).length, 6);
	assert.doesNotMatch(courseHtml, /href="\/ai-sandbox"/);
	assert.match(courseHtml, /href="\/en"/);
	response = await fetch(base + '/en/course/__data.json', { headers: { cookie } });
	assert.equal(response.status, 200);
	assert.match(response.headers.get('cache-control'), /no-store/);
	assert.match(await response.text(), /26 September/);
	response = await fetch(base + '/api/user/signout', {
		method: 'POST',
		headers: { origin: base, cookie }
	});
	assert.equal(response.status, 200);
	assert.match(response.headers.get('set-cookie') || '', /archweekend_access=;/);
	const afterLogout = await fetch(base + '/en/course', { redirect: 'manual' });
	assert.equal(afterLogout.headers.get('location'), '/en/user/signin');

	for (let attempt = 0; attempt < 11; attempt++) response = await login('wrong-password');
	assert.equal(response.status, 429);
	assert.match((await response.json()).message, /Too many attempts/);
	assert.ok(response.headers.get('retry-after'));
});
