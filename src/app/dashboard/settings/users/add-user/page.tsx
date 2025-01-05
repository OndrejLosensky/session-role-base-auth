import { getUser } from "@/app/utils/getUser";
import { Permission } from "@/app/utils/types";
import { hasPermission } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { AddNewUserForm } from "./AddNewUserForm";
import Link from "next/link";

export default async function AddUserPage() {
  const user = await getUser();
  const canCreateUser = await hasPermission(user.id, Permission.CREATE_USER);

  if (!canCreateUser) {
    redirect("/unauthorized");
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/dashboard/settings"
          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          ← Back to Dashboard
        </Link>
      </div>
      
      <div className="">
        <h1 className="text-2xl font-bold mb-6">Add New User</h1>
        <AddNewUserForm />
      </div>
    </div>
  );
} 