
import MeetingsList from "@/components/MeetingList";
export default function YourPage() {
    return (
        <div className="container mx-auto p-4 text-white">
            <h1 className="text-2xl font-bold mb-4">Your Upcoming Meetings</h1>
            <MeetingsList />
        </div>
    );
}