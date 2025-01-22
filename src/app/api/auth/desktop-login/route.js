import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import cors from 'cors';

const corsMiddleware = cors({
    origin: process.env.ALLOWED_ORIGINS.split(','),
    methods: ['POST'],
    credentials: true,
});

export async function POST(request) {
    // Apply CORS
    await new Promise((resolve, reject) => {
        corsMiddleware(request, NextResponse, (result) =>
            result instanceof Error ? reject(result) : resolve(result)
        );
    });

    const body = await request.json();
    const { email } = body;

    // Generate a unique state for this login attempt
    const state = crypto.randomUUID();

    // Store the state temporarily (you might want to use Redis or similar in production)
    // For now, we'll use a simple in-memory store
    globalThis.loginStates = globalThis.loginStates || new Map();
    globalThis.loginStates.set(state, { email, timestamp: Date.now() });

    const authUrl = `${process.env.NEXTAUTH_URL}/api/auth/signin/google?state=${state}`;

    return NextResponse.json({ url: authUrl });
}