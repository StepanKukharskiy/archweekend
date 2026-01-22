import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
    // If user is not authenticated, redirect to signin
    if (!locals.user) {
        throw redirect(303, '/user/signin');
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
