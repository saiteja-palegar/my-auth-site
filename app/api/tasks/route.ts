import { getServerSession } from "next-auth/next";
import { NextResponse } from 'next/server';
import { authOptions } from "../auth/[...nextauth]/auth.config";

export async function GET() {
    try {
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

        // First get the task lists
        const taskListsUrl = 'https://tasks.googleapis.com/tasks/v1/users/@me/lists';
        const taskListsResponse = await fetch(taskListsUrl, {
            headers: {
                'Authorization': `Bearer ${session.accessToken}`,
                'Accept': 'application/json',
            },
        });

        if (!taskListsResponse.ok) {
            const errorText = await taskListsResponse.text();
            console.error('Google Tasks API error details:', {
                status: taskListsResponse.status,
                statusText: taskListsResponse.statusText,
                errorText,
            });
            return NextResponse.json(
                {
                    error: `Google Tasks API error: ${taskListsResponse.status} ${taskListsResponse.statusText}`,
                    details: errorText
                },
                { status: taskListsResponse.status }
            );
        }

        const taskLists = await taskListsResponse.json();
        const allTasks = [];

        // Get tasks from all task lists
        for (const list of taskLists.items || []) {
            const tasksUrl = `https://tasks.googleapis.com/tasks/v1/lists/${list.id}/tasks`;
            const tasksResponse = await fetch(tasksUrl, {
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`,
                    'Accept': 'application/json',
                },
            });

            if (tasksResponse.ok) {
                const tasksData = await tasksResponse.json();
                const tasks = tasksData.items?.map((task: { id: string; title: string; notes?: string; due?: string; status: string }) => ({
                    id: task.id,
                    title: task.title,
                    description: task.notes || '',
                    due: task.due,
                    completed: task.status === 'completed',
                    status: task.status
                })) || [];
                allTasks.push(...tasks);
            } else {
                console.error(`Failed to fetch tasks for list ${list.id}`);
            }
        }

        return NextResponse.json(allTasks);
    } catch (error: unknown) {
        console.error('Unhandled error in tasks API:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch tasks',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}