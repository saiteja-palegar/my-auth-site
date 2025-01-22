'use client';

import { signIn } from 'next-auth/react';

export default function LoginButton() {
    return (
        <button
            onClick={() => signIn('google')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
            Sign in with Google
        </button>
    );
}