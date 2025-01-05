"use client";

import { useActionState } from "react";
import { createPermission, updatePermission } from "@/app/dashboard/settings/permissions/actions";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type PermissionState = {
  errors?: {
    name?: string[];
    description?: string[];
    _form?: string[];
  };
  success?: boolean;
};

interface PermissionFormProps {
  permission?: {
    id: string;
    name: string;
    description: string | null;
  };
}

export function PermissionForm({ permission }: PermissionFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<PermissionState, FormData>(
    permission ? updatePermission : createPermission,
    {
      errors: undefined,
      success: false,
    }
  );

  const handleSubmit = async (formData: FormData) => {
    await formAction(formData);
    startTransition(() => {
      if (state.success) {
        router.push('/dashboard');
        router.refresh();
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-4 max-w-md">
      {permission && <input type="hidden" name="id" value={permission.id} />}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="read_posts"
          defaultValue={permission?.name || ''}
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
          placeholder="Permission to read posts"
          defaultValue={permission?.description || ''}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {state?.errors?.description && (
          <p className="mt-1 text-sm text-red-600">{state.errors.description[0]}</p>
        )}
      </div>

      {state?.errors?._form && (
        <p className="text-sm text-red-600">{state.errors._form[0]}</p>
      )}

      <div className="flex items-center justify-between gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? 'Saving...' : (permission ? 'Update Permission' : 'Add Permission')}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>

      {state.success && (
        <p className="text-sm text-green-600">
          Permission {permission ? 'updated' : 'created'} successfully!
        </p>
      )}
    </form>
  );
}