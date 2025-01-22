export default function UserProfile({ session }) {
    return (
        <div className="text-center">
            <img
                src={session.user.image}
                alt={session.user.name}
                className="w-20 h-20 rounded-full mx-auto mb-4"
            />
            <h2 className="text-xl font-semibold">{session.user.name}</h2>
            <p className="text-gray-600">{session.user.email}</p>
        </div>
    );
}