import { redirect } from '@sveltejs/kit';
import { getCourseData } from '$lib/server/course-data';

/** @type {import('./$types').PageServerLoad} */
export function load({ locals }) {
	if (!locals.user) redirect(303, '/user/signin');
	return getCourseData('ru');
}
