import { NextResponse } from 'next/server';
import { generateJWT } from '@/lib/jwt';

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get('state');
    const code = searchParams.get('code');

    if (!state || !code) {
        return NextResponse.redirect('myapp://auth-error');
    }

    // Verify state and get stored email
    const storedData = globalThis.loginStates?.get(state);
    if (!storedData) {
        return NextResponse.redirect('myapp://auth-error?error=invalid_state');
    }

    // Clean up the stored state
    globalThis.loginStates.delete(state);

    // Generate JWT for the desktop app
    const token = await generateJWT({
        email: storedData.email,
        code
    });

    // Redirect to desktop app with token
    return NextResponse.redirect(`myapp://auth-success?token=${token}`);
}
