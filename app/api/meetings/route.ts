// app/api/meetings/route.ts
import { getServerSession } from "next-auth/next";
import { NextResponse } from 'next/server';
import { authOptions } from "../auth/[...nextauth]/auth.config";

export async function GET() {
    try {
        // Get the session and log its state
        const session = await getServerSession(authOptions);

        if (!session) {
            console.log("No session found");
            return NextResponse.json(
                { error: "Not authenticated - No session found" },
                { status: 401 }
            );
        }

        if (!session.accessToken) {
            console.log("No access token in session:", session);
            return NextResponse.json(
                { error: "Not authenticated - No access token" },
                { status: 401 }
            );
        }

        // Calculate time boundaries
        const now = new Date().toISOString();
        const thirtyDaysFromNow = new Date();
        console.log("Token:", session.accessToken)
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        // Create the URL with proper parameters
        const calendarUrl = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events');
        calendarUrl.search = new URLSearchParams({
            timeMin: now,
            timeMax: thirtyDaysFromNow.toISOString(),
            singleEvents: 'true',
            orderBy: 'startTime',
        }).toString();

        // Log the request details (excluding sensitive data)
        console.log('Fetching calendar data from:', calendarUrl.toString());
        console.log('Environment:', {
            NEXTAUTH_URL: process.env.NEXTAUTH_URL,
            NODE_ENV: process.env.NODE_ENV,
        });

        // Make the request to Google Calendar API
        const response = await fetch(calendarUrl.toString(), {
            headers: {
                'Authorization': `Bearer ${session.accessToken}`,
                'Accept': 'application/json',
            },
        });

        // Handle non-OK responses
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Google Calendar API error details:', {
                status: response.status,
                statusText: response.statusText,
                errorText,
                url: calendarUrl.toString(),
            });

            // Try to parse the error response
            let errorJson;
            try {
                errorJson = JSON.parse(errorText);
            } catch {
                errorJson = { error: errorText };
            }

            return NextResponse.json(
                {
                    error: `Google Calendar API error: ${response.status} ${response.statusText}`,
                    details: errorJson
                },
                { status: response.status }
            );
        }

        const data = await response.json();

        // Filter and format Google Meet events
        const meetEvents = data.items
            ?.filter((event: { hangoutLink?: string }) => event.hangoutLink)
            .map((event: { id: string; summary?: string; description?: string; start: { dateTime?: string; date?: string }; end: { dateTime?: string; date?: string }; hangoutLink?: string; attendees?: { email: string; displayName?: string }[] }) => ({
                id: event.id,
                summary: event.summary || 'No Title',
                description: event.description || '',
                start: event.start.dateTime || event.start.date,
                end: event.end.dateTime || event.end.date,
                meetLink: event.hangoutLink,
                attendees: event.attendees?.map((attendee: { email: string; displayName?: string }) => ({
                    email: attendee.email,
                    name: attendee.displayName,
                })) || [],
            })) || [];

        return NextResponse.json(meetEvents);
    } catch (error: unknown) {
        // Log the full error details
        if (error instanceof Error) {
            console.error('Unhandled error in meetings API:', {
                error,
                stack: error.stack,
                message: error.message,
            });
        } else {
            console.error('Unhandled error in meetings API:', {
                error,
                message: 'Unknown error type',
            });
        }

        return NextResponse.json(
            {
                error: 'Failed to fetch meetings',
                details: error instanceof Error ? error.message : 'Unknown error',
                type: error instanceof Error ? error.name : 'Unknown',
            },
            { status: 500 }
        );
    }
}