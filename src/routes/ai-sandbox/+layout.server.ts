import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { creditStore } from '$lib/server/recovery-credits';

export async function load({ locals }) {
    // If user is not authenticated, redirect to signin
    if (!locals.user) {
        throw redirect(303, '/user/signin');
    }

    if (locals.user.access === 'recovery') {
        try {
            return { user: { ...locals.user, credits: creditStore(env).balance(locals.user.email) }, sandboxUnavailable: false };
        } catch {
            return { user: { ...locals.user, credits: 0 }, sandboxUnavailable: true };
        }
    }

    // Fetch the latest user data including credits
    try {
        const userRecord = await locals.pb.collection('users').getOne(locals.user.id);
        return { 
            user: {
                ...locals.user,
                credits: userRecord.credits ?? 0
            }
        };
    } catch (err) {
        console.error('Error fetching user data:', err);
        // If we can't fetch user data, still return the user but with 0 credits
        return { 
            user: {
                ...locals.user,
                credits: 0
            }
        };
    }
}
