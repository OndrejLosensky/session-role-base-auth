"use client"

import { useState } from 'react';
import { ProfileAvatar } from "./ProfileAvatar";
import { UserPermissionsDialog } from './UserPermissionsDialog';
import { updateUserRole } from '../admin/actions';
import Link from 'next/link';
interface UserListItem {
  id: string;
  email: string;
  name: string | null;
  role: {
    id: string;
    name: string;
    permissions: { name: string }[];
  };
  profilePicture: string | null;
  profileColor: string | null;
  createdAt: Date;
}

interface UsersListProps {
  users: UserListItem[];
  roles: {
    id: string;
    name: string;
    description: string | null;
    permissions: { name: string }[];
    createdAt: Date;
    updatedAt: Date;
  }[];
  currentUserId: string;
  canCreateUser: boolean;
  usersCount?: number;
}

export function UsersList({ users, roles, currentUserId, canCreateUser, usersCount }: UsersListProps) {
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);

  const handleUpdateRole = async (userId: string, roleId: string) => {
    try {
      await updateUserRole(currentUserId, userId, roleId);
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Users ({usersCount})</h2>
        {canCreateUser && (
          <Link
            href  ="/admin/users/add-user"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            Add New User
          </Link>
        )}
      </div>
      <div className="divide-y">
        {users.map((user) => (
          <div key={user.id} className="py-4 flex items-center gap-4">
            <ProfileAvatar
              profilePicture={user.profilePicture}
              profileColor={user.profileColor}
              name={user.name || user.email}
              size="sm"
            />
            <div className="flex-1">
              <p className="font-semibold">{user.name || user.email}</p>
              <p className="text-sm text-gray-600">{user.role.name.toLowerCase()}</p>
            </div>
            <div className="text-sm text-gray-500">
              Joined {new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
              })}
            </div>
            <button
              onClick={() => setSelectedUser(user)}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
            >
              Edit Permissions
            </button>
          </div>
        ))}
      </div>

      {selectedUser && (
        <UserPermissionsDialog
          user={selectedUser}
          roles={roles}
          onClose={() => setSelectedUser(null)}
          onUpdate={handleUpdateRole}
        />
      )}
    </div>
  );
} 