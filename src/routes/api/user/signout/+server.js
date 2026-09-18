import { json } from '@sveltejs/kit';
import { SESSION_COOKIE } from '$lib/server/recordings-access';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals, cookies, url }) {
	if (request.headers.get('origin') !== url.origin) return json({ error: true }, { status: 403 });
	cookies.delete(SESSION_COOKIE, { path: '/' });
	cookies.delete('pb_auth', { path: '/' });
	locals.pb.authStore.clear();
	locals.user = undefined;
	return json({ message: 'Logged out' });
}
