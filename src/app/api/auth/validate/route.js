import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import cors from 'cors';

const corsMiddleware = cors({
    origin: process.env.ALLOWED_ORIGINS.split(','),
    methods: ['GET'],
    credentials: true,
});

export async function GET(request) {
    // Apply CORS
    await new Promise((resolve, reject) => {
        corsMiddleware(request, NextResponse, (result) =>
            result instanceof Error ? reject(result) : resolve(result)
        );
    });

    const headersList = headers();
    const token = headersList.get('authorization')?.replace('Bearer ', '');

    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    try {
        const decoded = await verifyJWT(token);
        return NextResponse.json({ valid: true, user: decoded });
    } catch (error) {
        return NextResponse.json({ valid: false, error: error.message }, { status: 401 });
    }
}