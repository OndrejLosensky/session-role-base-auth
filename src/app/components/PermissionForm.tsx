"use client";

import { useActionState } from "react";
import { createPermission } from "@/app/admin/permissions/actions";
import { useFormStatus } from "react-dom";

type PermissionState = {
  errors?: {
    name?: string[];
    description?: string[];
    _form?: string[];
  };
  success?: boolean;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
    >
      {pending ? "Creating..." : "Add Permission"}
    </button>
  );
}

export function PermissionForm() {
  const [state, formAction] = useActionState<PermissionState, FormData>(
    createPermission,
    {
      errors: undefined,
      success: false
    }
  );

  return (
    <form action={formAction} className="space-y-4 max-w-md">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Permission Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="READ_USER"
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
          name="description"
          id="description"
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Allows reading user information"
        />
        {state?.errors?.description && (
          <p className="mt-1 text-sm text-red-600">{state.errors.description[0]}</p>
        )}
      </div>

      {state?.errors?._form && (
        <p className="text-sm text-red-600">{state.errors._form[0]}</p>
      )}

      <div className="flex items-center gap-4">
        <SubmitButton />
        {state.success && (
          <p className="text-sm text-green-600">Permission created successfully!</p>
        )}
      </div>
    </form>
  );
} 