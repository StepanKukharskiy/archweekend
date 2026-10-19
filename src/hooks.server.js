import PocketBase from 'pocketbase';
import { redirect, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { serializeNonPOJOs } from '$lib/utils';
import { accessConfig, readSession, SESSION_COOKIE } from '$lib/server/recordings-access';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const english = event.url.pathname === '/en' || event.url.pathname.startsWith('/en/');
	// Remember the locale for payment services returning to the existing /register URL.
	if (!event.isDataRequest && (english || event.url.pathname === '/')) {
		const locale = english ? 'en' : 'ru';
		if (event.cookies.get('archweekend_locale') !== locale) {
			event.cookies.set('archweekend_locale', locale, {
				path: '/',
				httpOnly: false,
				secure: event.url.protocol === 'https:',
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 30
			});
		}
	}
	if (
		(event.url.pathname === '/register' || event.url.pathname === '/register/') &&
		event.cookies.get('archweekend_locale') === 'en'
	) {
		return new Response(null, {
			status: 303,
			headers: { location: `/en/register${event.url.search}`, 'cache-control': 'private, no-store' }
		});
	}
	const config = accessConfig(env);
	event.locals.pb = new PocketBase(env.DB_URL || 'http://127.0.0.1:8090');
	if (config.enabled) {
		// Never contact the lost database or accept old database sessions in recovery mode.
		event.locals.user = readSession(config, event.cookies.get(SESSION_COOKIE));
		if (!event.locals.user && event.cookies.get(SESSION_COOKIE)) {
			event.cookies.delete(SESSION_COOKIE, { path: '/' });
		}
	} else if (env.DB_URL) {
		event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
		try {
			if (event.locals.pb.authStore.isValid) {
				await event.locals.pb.collection('users').authRefresh();
				event.locals.user = serializeNonPOJOs(event.locals.pb.authStore.model);
			}
		} catch {
			event.locals.pb.authStore.clear();
		}
	}
	const coursePath = english ? '/en/course' : '/course';
	const course =
		event.url.pathname === coursePath || event.url.pathname.startsWith(`${coursePath}/`);
	// Check every request, including SvelteKit data requests and nested course routes.
	if (course && !event.locals.user) redirect(303, english ? '/en/user/signin' : '/user/signin');
	if (event.url.pathname.startsWith('/api/ai/') && !event.locals.user) {
		return json(
			{ message: 'Authentication required' },
			{ status: 401, headers: { 'cache-control': 'no-store' } }
		);
	}

	const response = await resolve(event);
	if (!config.enabled && env.DB_URL) {
		response.headers.append(
			'set-cookie',
			event.locals.pb.authStore.exportToCookie({
				httpOnly: true,
				secure: event.url.protocol === 'https:',
				sameSite: 'Lax',
				path: '/'
			})
		);
	}
	if (
		course ||
		event.url.pathname.startsWith('/api/ai/') ||
		event.locals.user ||
		event.url.pathname.startsWith('/api/user/')
	) {
		response.headers.set('cache-control', 'private, no-store');
	}
	return response;
}
