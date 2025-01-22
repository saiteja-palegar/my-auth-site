import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { generateJWT } from '@/lib/jwt';
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
    const { email, name } = body;

    // Here you would typically validate the user and possibly store them in a database
    // For this example, we'll just generate a JWT
    const token = await generateJWT({ email, name });

    return NextResponse.json({ token });
}