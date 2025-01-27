// app/login/page.tsx
'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn, useSession } from "next-auth/react";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('sessionId');
    const { data: session } = useSession();

    useEffect(() => {
        const sendTokenToGoServer = async (accessToken: string, refreshToken: string) => {
            try {
                const response = await fetch('http://localhost:9000/auth/callback', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        session_id: sessionId,
                        access_token: accessToken,
                        refresh_token: refreshToken
                    }),
                });

                if (response.ok) {
                    window.close();
                } else {
                    console.error('Failed to send tokens to server');
                }
            } catch (error) {
                console.error('Error sending tokens:', error);
            }
        };

        // Check if we have both session and accessToken
        if (session?.accessToken && session?.refreshToken && sessionId) {
            sendTokenToGoServer(session.accessToken, session.refreshToken);
        }
    }, [session, sessionId]);

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Sign in to continue
                </h1>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Use your Google account to sign in
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <button
                        onClick={() => signIn('google', { callbackUrl: window.location.href })}
                        className="w-full flex justify-center items-center gap-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continue with Google
                    </button>
                </div>
            </div>
        </div>
    );
}