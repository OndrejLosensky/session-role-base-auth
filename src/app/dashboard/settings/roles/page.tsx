import { getUser } from "@/app/utils/getUser";
import { Permission } from "@/app/utils/types";
import { hasPermission } from "@/lib/permissions";
import { RolesList } from "@/app/components/RolesList";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAllRolesNumber } from "@/app/utils/all";

async function getAllRoles() {
  return prisma.role.findMany({
    include: {
      permissions: true
    }
  });
}

export default async function RolesPage() {
  const user = await getUser();
  const canViewRoles = await hasPermission(user.id, Permission.MANAGE_ROLES);
  const canManageRoles = await hasPermission(user.id, Permission.MANAGE_ROLES);

  if (!canViewRoles) {
    redirect("/unauthorized");
  }

  const rolesCount= await getAllRolesNumber();

  const roles = await getAllRoles();

  return (
    <div className="p-6 w-full">
      <div className="mb-6">
        <Link
          href="/dashboard/settings"
          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          ← Back to settings
        </Link>
      </div>
      
      <div className="">
        <h1 className="text-2xl font-bold mb-6">Roles Management</h1>
        <RolesList 
          roles={roles}
          canManageRoles={canManageRoles}
          rolesCount={rolesCount}
        />
      </div>
    </div>
  );
}