"use client"

import { useState } from 'react';

interface UserPermissionsDialogProps {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: {
      id: string;
      name: string;
      permissions: { name: string }[];
    };
  };
  roles: {
    id: string;
    name: string;
    permissions: { name: string }[];
  }[];
  onClose: () => void;
  onUpdate: (userId: string, roleId: string) => Promise<void>;
}

export function UserPermissionsDialog({ user, roles, onClose, onUpdate }: UserPermissionsDialogProps) {
  const [selectedRoleId, setSelectedRoleId] = useState(user.role.id);
  const [isUpdating, setIsUpdating] = useState(false);

  const selectedRole = roles.find(role => role.id === selectedRoleId);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await onUpdate(user.id, selectedRoleId);
      onClose();
    } catch (error) {
      console.error('Failed to update user role:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Edit User Permissions</h2>
        
        <div className="mb-4">
          <p className="font-medium">{user.name || user.email}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        {selectedRole && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Included Permissions
            </label>
            <div className="text-sm text-gray-600 space-y-1">
              {selectedRole.permissions.map((permission) => (
                <div key={permission.name} className="flex items-center gap-2">
                  <span>✓</span>
                  <span className="capitalize">
                    {permission.name.replace(/_/g, ' ').toLowerCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isUpdating ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
} 