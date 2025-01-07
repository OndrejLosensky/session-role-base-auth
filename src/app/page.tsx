import { UserMenu } from './components/UserMenu';
import Link from 'next/link';
import { getUser } from './utils/getUser';

export default async function Home() {
  const user = await getUser();
  const isAuthenticated = !!user;
  
  return (
    <div>
      <header className="border-b">
        <nav className="max-w-7xl mx-auto p-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl"> Session role based auth boilerplate </Link>
          {isAuthenticated ? (
            <UserMenu user={{
              ...user,
              role: user.role.name,
              profilePicture: user.profilePicture ?? null,
              profileColor: user.profileColor ?? null
            }} />
          ) : (
            <Link 
              href="/login" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Login
            </Link>
          )}
        </nav>
      </header>
    </div>
  );
}
