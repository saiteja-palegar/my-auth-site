// app/api/auth/[...nextauth]/auth.config.ts
import type { AuthOptions, DefaultSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

declare module "next-auth" {
    interface Session extends DefaultSession {
        accessToken?: string;
        refreshToken?: string;
        error?: string;
    }
}

// Helper to get the base URL for the application

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: 'openid email profile https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/tasks.readonly',
                    access_type: 'offline',
                    prompt: 'consent',
                    response_type: 'code',
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    expiresAt: account.expires_at ? account.expires_at * 1000 : undefined,
                }
            }

            // Add debug logging for token refresh
            if (token.expiresAt && Date.now() >= token.expiresAt) {
                console.log('Token expired, attempting refresh...');
            }

            if (token.expiresAt && Date.now() < token.expiresAt) {
                return token;
            }

            try {
                const response = await fetch('https://oauth2.googleapis.com/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        client_id: process.env.GOOGLE_CLIENT_ID!,
                        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                        grant_type: 'refresh_token',
                        refresh_token: token.refreshToken as string,
                    }),
                });

                const tokens = await response.json();

                if (!response.ok) {
                    console.error('Token refresh error:', {
                        status: response.status,
                        tokens,
                    });
                    throw tokens;
                }

                console.log('Token refreshed successfully');

                return {
                    ...token,
                    accessToken: tokens.access_token,
                    expiresAt: Date.now() + tokens.expires_in * 1000,
                };
            } catch (error) {
                console.error('Error refreshing access token:', error);
                return { ...token, error: 'RefreshAccessTokenError' };
            }
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            session.refreshToken = token.refreshToken as string;  // Add this line
            session.error = token.error;
            return session;
        },
    },
    debug: process.env.NODE_ENV === 'development',
    // Add better security with secure cookies in production
    cookies: {
        sessionToken: {
            name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
    },
}