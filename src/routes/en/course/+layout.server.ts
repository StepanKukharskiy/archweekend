import { redirect } from '@sveltejs/kit';

export function load({ locals }) {
	if (!locals.user) redirect(303, '/en/user/signin');
	return { user: locals.user };
}
