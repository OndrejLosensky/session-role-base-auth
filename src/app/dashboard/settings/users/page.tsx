import { getUser } from "@/app/utils/getUser";
import { Permission } from "@/app/utils/types";
import { hasPermission } from "@/lib/permissions";
import { UsersList } from "@/app/components/UsersList";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

import { getAllUsersNumber } from "@/app/utils/all";

async function getAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: {
        select: {
          id: true,
          name: true,
          permissions: {
            select: {
              name: true
            }
          }
        }
      },
      profilePicture: true,
      profileColor: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

async function getAllRoles() {
  return prisma.role.findMany({
    include: {
      permissions: true
    }
  });
}

export default async function UsersPage() {
  const user = await getUser();  
  const canManageSettings = await hasPermission(user.id, Permission.MANAGE_SETTINGS);

  if (!canManageSettings) {
    return (
      <div>
        Insuficient permissions 
      </div>
    )
  }

  const users = await getAllUsers();
  const roles = await getAllRoles();
  const usersCount = await getAllUsersNumber();

  return (
    <div className="p-6 w-full">
      <div className="mb-6">
        <Link
          href="/dashboard/settings"
          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          ← Back to Dashboard
        </Link>
      </div>
      
      <div className="">
        <h1 className="text-2xl font-bold mb-6">Users Management</h1>
        <UsersList 
          users={users} 
          roles={roles}
          currentUserId={user.id}
          canCreateUser={canManageSettings}
          usersCount={usersCount}
        />
      </div>
    </div>
  );
} 