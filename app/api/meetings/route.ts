// app/api/meetings/route.ts
import { getServerSession } from "next-auth/next";
import { NextResponse } from 'next/server';
import { authOptions } from "../auth/[...nextauth]/auth.config"; // We need to import auth options

export async function GET() {
    try {
        // We need to pass authOptions to getServerSession
        const session = await getServerSession(authOptions);

        if (!session?.accessToken) {
            console.log("No access token found in session:", session);
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        // Calculate time boundaries
        const now = new Date().toISOString();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        // Add error logging for debugging
        console.log("Fetching meetings with token:", session.accessToken?.slice(0, 10) + "...");

        // Fetch events from Google Calendar API
        const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events?${new URLSearchParams({
                timeMin: now,
                timeMax: thirtyDaysFromNow.toISOString(),
                singleEvents: 'true',
                orderBy: 'startTime',
            }).toString()
            }`,
            {
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`,
                    'Accept': 'application/json',
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('Google Calendar API error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorData
            });
            throw new Error(`Google Calendar API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Filter and format Google Meet events
        const meetEvents = data.items
            ?.filter((event: { hangoutLink?: string }) => event.hangoutLink)
            .map((event: { id: string; summary?: string; description?: string; start: { dateTime?: string; date?: string }; end: { dateTime?: string; date?: string }; hangoutLink: string; attendees?: { email: string; displayName: string }[] }) => ({
                id: event.id,
                summary: event.summary || 'No Title',
                description: event.description || '',
                start: event.start.dateTime || event.start.date,
                end: event.end.dateTime || event.end.date,
                meetLink: event.hangoutLink,
                attendees: event.attendees?.map((attendee: { email: string; displayName: string }) => ({
                    email: attendee.email,
                    name: attendee.displayName,
                })) || [],
            })) || [];

        return NextResponse.json(meetEvents);
    } catch (error: unknown) {
        console.error('Error in meetings API:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch meetings';
        const errorStatus = (error instanceof Error && 'status' in error && typeof error.status === 'number') ? error.status : 500;
        return NextResponse.json(
            { error: errorMessage },
            { status: errorStatus }
        );
    }
}