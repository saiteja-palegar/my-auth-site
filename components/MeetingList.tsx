// components/MeetingsList.tsx
'use client';

import { useMeetings } from '../hooks/useMeetings';
import { format } from 'date-fns';

export default function MeetingsList() {
    const { meetings, loading, error } = useMeetings();

    if (loading) {
        return (
            <div className="flex justify-center items-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 p-4">
                Error loading meetings: {error}
            </div>
        );
    }

    if (!meetings.length) {
        return (
            <div className="text-gray-500 p-4">
                No upcoming meetings found.
            </div>
        );
    }

    return (
        <div className="space-y-4 text-white">
            {meetings.map((meeting) => (
                <div
                    key={meeting.id}
                    className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                    <h3 className="font-semibold text-lg">{meeting.summary}</h3>
                    <div className="text-sm text-gray-600 mt-2">
                        {format(new Date(meeting.start), 'PPp')} - {format(new Date(meeting.end), 'p')}
                    </div>
                    {meeting.description && (
                        <p className="mt-2 text-gray-700">{meeting.description}</p>
                    )}
                    <div className="mt-3">
                        <a
                            href={meeting.meetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Join Meeting
                        </a>
                    </div>
                    {meeting.attendees.length > 0 && (
                        <div className="mt-3">
                            <h4 className="text-sm font-medium">Attendees:</h4>
                            <div className="mt-1 space-y-1">
                                {meeting.attendees.map((attendee, index) => (
                                    <div key={index} className="text-sm ">
                                        {attendee.name || attendee.email}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}