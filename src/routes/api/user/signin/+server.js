import { error, redirect, json } from '@sveltejs/kit'

export async function POST({ request, locals, cookies }) {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');
    let response = {}

    // Validate input
    if (!email || !password) {
        return json({ 
            message: 'Email and password are required',
            error: true
        }, { status: 400 });
    }

    try {
            // Handle email/password login

            await locals.pb.collection('users').authWithPassword(email, password);

            // Check if the authentication was successful
            if (locals.pb.authStore.isValid) {
                const currentTime = new Date().toISOString();
                // Update the last login time for the authenticated user
                await locals.pb.collection("users").update(locals.pb.authStore.model.id, { lastLogin: currentTime });
                response = {
                    message: 'Success',
                    user: {
                        email: locals.pb.authStore.model.email,
                        id: locals.pb.authStore.model.id,
                        requests: locals.pb.authStore.model.requests,
                        verified: locals.pb.authStore.model.verified
                    }
                };
            } else {
                locals.pb.authStore.clear();
                response = {
                    message: 'Something went wrong',
                };
            }

        return json(response);

    } catch (err) {
        console.log('Sign-in error:', err);
        console.log('Error details:', {
            message: err?.message,
            response: err?.response,
            data: err?.data,
            status: err?.status
        });
        
        // Extract error message from PocketBase error
        let errorMessage = 'Something went wrong while logging in';
        let statusCode = 500;
        
        // Try different error structures that PocketBase might use
        const pbError = err?.response?.data || err?.data || err;
        
        if (pbError?.message) {
            errorMessage = pbError.message;
        } else if (pbError?.email?.message) {
            errorMessage = pbError.email.message;
        } else if (pbError?.password?.message) {
            errorMessage = pbError.password.message;
        } else if (typeof pbError === 'string') {
            errorMessage = pbError;
        } else if (err?.message) {
            errorMessage = err.message;
        }
        
        // Check for authentication-related errors
        const lowerMessage = errorMessage.toLowerCase();
        if (lowerMessage.includes('failed to authenticate') || 
            lowerMessage.includes('invalid login') ||
            lowerMessage.includes('invalid email') ||
            lowerMessage.includes('invalid password') ||
            lowerMessage.includes('incorrect password') ||
            err?.status === 400) {
            statusCode = 401;
            errorMessage = 'Invalid email or password';
        }
        
        return json({ 
            message: errorMessage,
            error: true
        }, { status: statusCode });
    }
}