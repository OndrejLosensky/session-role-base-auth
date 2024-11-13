'use client';

import { useActionState } from 'react';
import { createRole, updateRole } from '../admin/actions';
import { Permission } from '../utils/types';

type RoleState = {
  errors?: {
    id?: string[];
    name?: string[];
    description?: string[];
    permissions?: string[];
    _form?: string[];
  };
  success?: boolean;
};

interface RoleFormProps {
  role?: {
    id: string;
    name: string;
    description: string | null;
    permissions: { name: string }[];
  };
  onSuccess?: () => void;
}

export function RoleForm({ role, onSuccess }: RoleFormProps) {
  const initialState: RoleState = {
    errors: undefined,
    success: false
  };

  const [state, action] = useActionState<RoleState, FormData>(
    role ? updateRole : createRole,
    initialState
  );

  const handleAction = async (formData: FormData) => {
    await action(formData);
    if (state.success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form action={handleAction} className="space-y-4">
      {role && <input type="hidden" name="id" value={role.id} />}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Role Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={role?.name || ''}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {state?.errors?.name && (
          <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={role?.description || ''}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {state?.errors?.description && (
          <p className="mt-1 text-sm text-red-600">{state.errors.description[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Permissions
        </label>
        <div className="space-y-2">
          {Object.values(Permission).map((permission) => (
            <div key={permission} className="flex items-center">
              <input
                type="checkbox"
                id={permission}
                name="permissions"
                value={permission}
                defaultChecked={role?.permissions.some(p => p.name === permission)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={permission} className="ml-2 text-sm text-gray-700">
                {permission.split('_').join(' ')}
              </label>
            </div>
          ))}
        </div>
        {state?.errors?.permissions && (
          <p className="mt-1 text-sm text-red-600">{state.errors.permissions[0]}</p>
        )}
      </div>

      {state?.errors?._form && (
        <p className="text-sm text-red-600">{state.errors._form[0]}</p>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          {role ? 'Update Role' : 'Create Role'}
        </button>
      </div>
    </form>
  );
} 