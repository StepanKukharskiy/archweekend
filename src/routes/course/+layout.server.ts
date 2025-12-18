import { redirect } from '@sveltejs/kit';

export function load({ locals }) {
    console.log(locals)
    // If user is not authenticated, redirect to signin
    if (!locals.user) {
        throw redirect(303, '/user/signin');
    }

    return { user: locals.user };
}