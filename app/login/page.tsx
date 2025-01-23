// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
    // Using the new App Router hooks for query parameters
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('sessionId');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Helper function to generate a demo token
    const generateDemoToken = () => {
        const random = Math.random().toString(36).substring(2);
        const timestamp = Date.now().toString(36);
        return `demo_${random}_${timestamp}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (!sessionId) {
                throw new Error('No session ID provided');
            }

            // Generate a demo token - in a real app, this would come from your auth service
            const token = generateDemoToken();

            // Send token back to your Go server
            const response = await fetch('http://localhost:9000/auth/callback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    session_id: sessionId,
                    token: token,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send token to server');
            }

            // Clear any existing errors
            setError('');

            // Close the window after successful authentication
            window.close();

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
            console.error('Auth error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Sign in to continue
                </h1>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Enter your credentials to proceed
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-sm text-red-600 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}