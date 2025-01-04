import { UserMenu } from './components/UserMenu';
import Link from 'next/link';
import { getUser } from './utils/getUser';

export default async function Home() {
  const user = await getUser();
  
  return (
    <div>
      <header className="border-b">
        <nav className="max-w-7xl mx-auto p-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl">Session-base-role-Auth</Link>
          <UserMenu user={{
          ...user,
          role: user.role.name,
          profilePicture: user.profilePicture ?? null,
          profileColor: user.profileColor ?? null
        }} />
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mt-24">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Next.js Authentication Showcase
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            A complete authentication solution featuring session management, role-based access control, and user profiles
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {!user ? (
              <Link
                href="/login"
                className="rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Try it out
              </Link>
            ) : (
              <Link
                href="/admin"
                className="rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Go to Dashboard
              </Link>
            )}
            <a
              href="https://github.com/OndrejLosensky/session-role-base-auth"
              className="text-sm font-semibold leading-6 text-gray-900"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative rounded-lg border border-gray-200 p-8">
            <div className="absolute -top-4 left-4 inline-block rounded-xl bg-blue-600 p-2 shadow-lg">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-medium">Session Management</h3>
            <p className="mt-2 text-gray-500">Secure session-based authentication using JWT tokens stored in HTTP-only cookies</p>
          </div>

          <div className="relative rounded-lg border border-gray-200 p-8">
            <div className="absolute -top-4 left-4 inline-block rounded-xl bg-green-600 p-2 shadow-lg">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-medium">Role-Based Access</h3>
            <p className="mt-2 text-gray-500">Granular access control with user roles and permissions management</p>
          </div>

          <div className="relative rounded-lg border border-gray-200 p-8">
            <div className="absolute -top-4 left-4 inline-block rounded-xl bg-purple-600 p-2 shadow-lg">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-medium">Security First</h3>
            <p className="mt-2 text-gray-500">Built with security best practices including password hashing, CSRF protection, and audit logging</p>
          </div>
        </div>
      </div>
    </div>
  );
}
