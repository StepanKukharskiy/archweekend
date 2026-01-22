// src/hooks.server.js
import PocketBase from 'pocketbase';
import { serializeNonPOJOs } from '$lib/utils';
import { DB_URL } from '$env/static/private'

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    // Create PocketBase instance
    event.locals.pb = new PocketBase(DB_URL);
    
    // Override PocketBase's internal fetch to use event.fetch for relative URLs
    // This is necessary because SvelteKit requires event.fetch for relative URLs in server context
    if (event.locals.pb.client && typeof event.locals.pb.client.fetch === 'function') {
        const originalFetch = event.locals.pb.client.fetch.bind(event.locals.pb.client);
        event.locals.pb.client.fetch = async (url, options = {}) => {
            // If URL is relative, use event.fetch; otherwise use original fetch
            if (typeof url === 'string' && (url.startsWith('/') || !url.match(/^https?:\/\//))) {
                return event.fetch(url, options);
            }
            // For absolute URLs, use the original fetch
            return originalFetch(url, options);
        };
    } else {
        // Fallback: if client.fetch doesn't exist, try to patch at a different level
        // This handles different PocketBase versions
        console.warn('Could not patch PocketBase fetch - ensure DB_URL is an absolute URL');
    }

    // load the store data from the request cookie string
    event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

    try {
        // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
        event.locals.pb.authStore.isValid && await event.locals.pb.collection('users').authRefresh();
        if (event.locals.pb.authStore.isValid) {
            event.locals.user = serializeNonPOJOs(event.locals.pb.authStore.model);
        } else {
            event.locals.user = undefined;
        }
    } catch (_) {
        // clear the auth store on failed refresh
        event.locals.pb.authStore.clear();
    }

    const response = await resolve(event);

    // send back the default 'pb_auth' cookie to the client with the latest store state
    response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie());

    return response;
}