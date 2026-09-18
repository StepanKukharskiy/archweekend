import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { accessConfig, canSignIn, createSession, createLoginLimiter, normalizeEmail, SESSION_COOKIE, SESSION_SECONDS } from '$lib/server/recordings-access';

const limiter = createLoginLimiter();
const invalid = () => json({ error: true, message: 'Неверный email или пароль.' }, { status: 401 });

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals, cookies, url, getClientAddress }) {
	if (request.headers.get('origin') !== url.origin) return json({ error: true, message: 'Недопустимый источник запроса.' }, { status: 403 });
	const address = getClientAddress();
	const retryAfter = limiter.consume(address);
	if (retryAfter) return json({ error: true, message: 'Слишком много попыток. Попробуйте через 15 минут.' }, { status: 429, headers: { 'retry-after': String(retryAfter) } });
	let form;
	try { form = await request.formData(); } catch { return invalid(); }
	const email = form.get('email');
	const password = form.get('password');
	if (typeof email !== 'string' || typeof password !== 'string' || email.length > 254 || password.length > 256) return invalid();
	const config = accessConfig(env);
	if (config.enabled) {
		if (!config.ready) return json({ error: true, message: 'Вход временно недоступен. Напишите hello@salab.org.' }, { status: 503 });
		if (!canSignIn(config, email, password)) return invalid();
		cookies.set(SESSION_COOKIE, createSession(config, email), {
			path: '/', httpOnly: true, secure: url.protocol === 'https:', sameSite: 'lax', maxAge: SESSION_SECONDS
		});
		cookies.delete('pb_auth', { path: '/' });
		limiter.clear(address);
		return json({ message: 'Success' });
	}
	if (!env.DB_URL) return json({ error: true, message: 'Вход временно недоступен. Напишите hello@salab.org.' }, { status: 503 });
	try {
		await locals.pb.collection('users').authWithPassword(normalizeEmail(email), password);
		if (!locals.pb.authStore.isValid) return invalid();
		limiter.clear(address);
		return json({ message: 'Success' });
	} catch {
		locals.pb.authStore.clear();
		return invalid();
	}
}
