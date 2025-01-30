// app/home/page.tsx
import MeetingsList from "@/components/MeetingList";
import TasksList from "@/components/TasksLists";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/auth.config";
export default async function YourPage() {
    const session = await getServerSession(authOptions);

    return (
        <div className="container mx-auto p-4 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h1 className="text-2xl font-bold mb-4">Your Upcoming Meetings</h1>
                    <MeetingsList />
                </div>
                <div>
                    <h1 className="text-2xl font-bold mb-4">Your Tasks</h1>
                    <TasksList />
                </div>
            </div>
        </div>

    );
}