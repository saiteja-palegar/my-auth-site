import { getServerSession } from 'next-auth';
import LoginButton from '@/components/LoginButton';
import UserProfile from '@/components/UserProfile';

export default async function Home() {
  const session = await getServerSession();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">
          Desktop App Authentication
        </h1>

        {session ? (
          <UserProfile session={session} />
        ) : (
          <LoginButton />
        )}
      </div>
    </main>
  );
}