import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Task {
    id: string;
    title: string;
    description: string;
    due: string | null;
    completed: boolean;
    status: string;
}

export function useTasks() {
    const { data: session, status } = useSession();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = async () => {
        if (status === 'authenticated' && session) {
            try {
                setLoading(true);
                const response = await fetch('/api/tasks');
                if (!response.ok) {
                    throw new Error('Failed to fetch tasks');
                }
                const data = await response.json();
                setTasks(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (status === 'authenticated') {
            fetchTasks();
        }
    }, [session, status]);

    return { tasks, loading, error, refetch: fetchTasks };
}