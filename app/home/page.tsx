
import MeetingsList from "@/components/MeetingList";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/auth.config";
export default async function YourPage() {
    const session = await getServerSession(authOptions);

    return (
        <div className="container mx-auto p-4 text-white">
            <h1 className="text-2xl font-bold mb-4">Your Upcoming Meetings</h1>
            {session && <h1 className="text-2xl font-bold mb-4">Your Upcoming Meetings {session.accessToken}</h1>}
            <MeetingsList />
        </div>
    );
}