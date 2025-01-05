import { getUser } from "@/app/utils/getUser";
import { Permission } from "@/app/utils/types";
import { hasPermission } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { RoleForm } from "@/app/components/RoleForm";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AddRolePage() {
  const user = await getUser();
  const canManageRoles = await hasPermission(user.id, Permission.MANAGE_ROLES);

  if (!canManageRoles) {
    redirect("/unauthorized");
  }

  const permissions = await prisma.permission.findMany({
    select: {
      id: true,
      name: true,
      description: true,
    }
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/dashboard/settings"
          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          ← Back to settings
        </Link>
      </div>
      
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Add New Role</h1>
        <RoleForm permissions={permissions} />
      </div>
    </div>
  );
} 