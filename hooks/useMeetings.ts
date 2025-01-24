// hooks/useMeetings.ts
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Meeting {
    id: string;
    summary: string;
    description: string;
    start: string;
    end: string;
    meetLink: string;
    attendees: Array<{
        email: string;
        name?: string;
    }>;
}

export function useMeetings() {
    const { data: session, status } = useSession();
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchMeetings() {
            if (status === 'authenticated' && session) {
                try {
                    const response = await fetch('/api/meetings');
                    if (!response.ok) {
                        throw new Error('Failed to fetch meetings');
                    }
                    const data = await response.json();
                    setMeetings(data);
                    setError(null);
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'An error occurred');
                } finally {
                    setLoading(false);
                }
            }
        }

        if (status === 'authenticated') {
            fetchMeetings();
        }
    }, [session, status]);

    return { meetings, loading, error };
}