"use client";

import { useFormStatus } from "react-dom";
import { createUser } from "./actions";
import { generateGradient } from "@/app/utils/generateGradient";
import { useEffect, useState, useActionState } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-400"
    >
      {pending ? "Creating..." : "Create User"}
    </button>
  );
}

export function AddNewUserForm() {
  const [state, formAction] = useActionState(createUser, {
    errors: {},
    success: false,
  });
  const [profileColor, setProfileColor] = useState(generateGradient());

  useEffect(() => {
    if (state.success) {
      // Reset form
      const form = document.querySelector('form') as HTMLFormElement;
      form?.reset();
      setProfileColor(generateGradient());
    }
  }, [state.success]);

  return (
    <form action={formAction} className="space-y-4 max-w-md">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
        />
        {state.errors?.email && (
          <p className="mt-1 text-sm text-red-600">{state.errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
        />
        {state.errors?.name && (
          <p className="mt-1 text-sm text-red-600">{state.errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
        />
        {state.errors?.password && (
          <p className="mt-1 text-sm text-red-600">{state.errors.password}</p>
        )}
      </div>

      <div>
        <label htmlFor="roleId" className="block text-sm font-medium text-gray-700">
          Role
        </label>
        <select
          id="roleId"
          name="roleId"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
        >
          <option value="user">User</option>
          <option value="admin">Bartender</option>
          <option value="manager">Admin</option>
        </select>
        {state.errors?.roleId && (
          <p className="mt-1 text-sm text-red-600">{state.errors.roleId}</p>
        )}
      </div>

      <input type="hidden" name="profileColor" value={profileColor} />

      <div className="flex items-center gap-4">
        <SubmitButton />
        {state.success && (
          <p className="text-sm text-green-600">User created successfully!</p>
        )}
      </div>
    </form>
  );
} 