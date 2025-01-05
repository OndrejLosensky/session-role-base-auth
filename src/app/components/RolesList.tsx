"use client";

import Link from "next/link";

import { deleteRole } from "../dashboard/settings/actions";
import { useRouter } from "next/navigation";

interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions: { name: string }[];
  createdAt: Date;
  updatedAt: Date;
}

interface RolesListProps {
  roles: Role[];
  canManageRoles: boolean;
  showViewAll?: boolean;
  rolesCount?: number;
}

export function RolesList({ roles, canManageRoles, rolesCount }: RolesListProps) {
  const router = useRouter();

  const handleDelete = async (roleId: string, roleName: string) => {
    if (!confirm(`Are you sure you want to delete the role "${roleName}"?`)) {
      return;
    }

    const result = await deleteRole(roleId);
    
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || 'Failed to delete role');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Roles ({rolesCount})</h2>
        <div className="flex gap-2">          
          {canManageRoles && (
            <Link
              href="/dashboard/settings/roles/add"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              Add New Role
            </Link>
          )}
        </div>
      </div>
      <div className="divide-y">
        {roles.map((role) => (
          <div key={role.id} className="py-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold capitalize">{role.name.toLowerCase()}</h3>
                {role.description && (
                  <p className="text-sm text-gray-600">{role.description}</p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">
                  {role.permissions.length} permissions
                </div>
                {canManageRoles && (
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/settings/roles/${role.id}/edit`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit Role
                    </Link>
                    <button
                      onClick={() => handleDelete(role.id, role.name)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2">
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission) => (
                  <span
                    key={permission.name}
                    className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700 capitalize"
                  >
                    {permission.name.toLowerCase().replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}