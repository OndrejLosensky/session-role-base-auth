import { getUser } from "@/app/utils/getUser";
import { UserMenu } from "../components/UserMenu";
import { UsersList } from "@/app/components/UsersList";
import { prisma } from "@/lib/prisma";
import { Role } from "../utils/types";
import { ProfileAvatar } from "../components/ProfileAvatar";

async function getAllUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      profilePicture: true,
      profileColor: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  return users;
}

export default async function Admin() {
  const user = await getUser();
  const isAdmin = user.role === Role.ADMIN;
  const allUsers = isAdmin ? await getAllUsers() : [];

  return (
    <div>
      <nav className="bg-white shadow-md px-8 py-1 w-screen">
        <div className="flex items-center justify-between flex-row">
          <h1 className="text-xl font-bold">Dashboard</h1>         
          <UserMenu user={user} />
        </div>
      </nav>

      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Welcome 👋, {user.name || user.email}!</h1>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>

          <div className="grid gap-4">
            <div className="mb-4">
              <ProfileAvatar
                profilePicture={user.profilePicture}
                profileColor={user.profileColor}
                name={user.name || user.email}
                size="lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-600 text-sm">ID</label>
                <p className="font-mono">{user.id}</p>
              </div>

              <div>
                <label className="text-gray-600 text-sm">Email</label>
                <p>{user.email}</p>
              </div>

              <div>
                <label className="text-gray-600 text-sm">Name</label>
                <p>{user.name || "Not set"}</p>
              </div>

              <div>
                <label className="text-gray-600 text-sm">Role</label>
                <p className="capitalize">{user.role.toLowerCase()}</p>
              </div>

              <div>
                <label className="text-gray-600 text-sm">Created At</label>
                <p>{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>

              <div>
                <label className="text-gray-600 text-sm">Last Updated</label>
                <p>{new Date(user.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Users List - Only shown to admins */}
        {isAdmin && allUsers.length > 0 && (
          <UsersList users={allUsers} />
        )}
      </div>
    </div>
  );
}