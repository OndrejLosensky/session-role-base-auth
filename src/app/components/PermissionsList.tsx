"use client"

import Link from "next/link";
import { useState } from "react";
import { deletePermission } from "@/app/admin/permissions/actions";

interface Permission {
  id: string;
  name: string;
  description: string | null;
}

interface PermissionsListProps {
  permissions: Permission[];
  canManagePermissions: boolean;
  permissionsCount?: number;
}

export function PermissionsList({
  permissions,
  canManagePermissions,
  permissionsCount
}: PermissionsListProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this permission?')) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const result = await deletePermission(id);
      if (!result.success) {
        setError(result.error || 'Failed to delete permission');
      }
    } catch {
      setError('An error occurred while deleting the permission');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      {error && (
        <div className="mb-4 text-sm text-red-600">{error}</div>
      )}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Permissions ({permissionsCount})</h2>
        {canManagePermissions && (
          <Link
            href="/admin/permissions/add"
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
          >
            Add New Permission
          </Link>
        )}
      </div>
      <div className="divide-y">
        {permissions.map((permission) => (
          <div key={permission.id} className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{permission.name}</h3>
              {permission.description && (
                <p className="text-sm text-gray-600">{permission.description}</p>
              )}
            </div>
            {canManagePermissions && (
              <div className="flex space-x-2">
                <Link
                  href={`/admin/permissions/${permission.id}/edit`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(permission.id)}
                  disabled={isDeleting}
                  className="text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
