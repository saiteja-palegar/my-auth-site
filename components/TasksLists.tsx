'use client';

import { useTasks } from "@/hooks/useTasks";
import { RotateCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function TasksList() {
    const { tasks, loading, error, refetch } = useTasks();

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <RotateCw className="h-8 w-8 animate-spin text-gray-500 dark:text-gray-400" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center gap-3 p-4 mb-4 text-red-800 bg-red-50 dark:bg-red-900/50 dark:text-red-100 rounded-lg">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Tasks ({tasks.length})</h2>
                <button
                    onClick={() => refetch()}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <RotateCw className="h-5 w-5" />
                </button>
            </div>
            <div className="space-y-4">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                                <CheckCircle2
                                    className={`h-5 w-5 ${task.completed
                                        ? 'text-green-500'
                                        : 'text-gray-400 dark:text-gray-500'}`}
                                />
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                    {task.title}
                                </h3>
                            </div>
                            {task.due && (
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Due: {new Date(task.due).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                        {task.description && (
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                {task.description}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}