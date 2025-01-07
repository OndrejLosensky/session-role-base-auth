'use client';

import { useFormState } from 'react-dom';
import { createRole, updateRole } from '../dashboard/settings/actions';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
  permissions: {
    id: string;
    name: string;
    description: string | null;
  }[];
  onSuccess?: () => void;
}

export function RoleForm({ role, permissions, onSuccess }: RoleFormProps) {
  const [state, formAction] = useFormState<RoleState, FormData>(
    role ? updateRole : createRole,
    { errors: {}, success: false }
  );
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push('/dashboard/settings');
      router.refresh();
      onSuccess?.();
    }
  }, [state?.success, router, onSuccess]);

  return (
    <form action={formAction}>
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

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Permissions
        </label>
        <div className="grid grid-cols-2 gap-2">
          {permissions.map((permission) => (
            <label key={permission.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="permissions"
                value={permission.name}
                defaultChecked={role?.permissions.some(p => p.name === permission.name)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">
                {permission.name.toLowerCase().replace(/_/g, ' ')}
                {permission.description && (
                  <span className="text-gray-500 text-xs block">
                    {permission.description}
                  </span>
                )}
              </span>
            </label>
          ))}
        </div>
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