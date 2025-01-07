import { UserMenu } from '../UserMenu';
import Link from 'next/link';
import { getUser } from '../../utils/getUser';

import data from "@/resources.json";


export default async function Navbar () {
    const user = await getUser();
    const isAuthenticated = !!user;

    return (
        <header className="border-b">
        <nav className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className='flex flex-row items-center'>
            <Link href="/" className="font-bold text-xl"> Démonická </Link>
            <div className='flex flex-row gap-x-4 ml-8'>
                <Link href="/muj-prehled"> My overview </Link>
                <Link href="/zebricek"> Leaderboard </Link>
                <Link href="/profil"> Profile </Link>
            </div>
          </div>
        


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
                {data.login}
            </Link>
          )}
        </nav>
      </header>
    )
}