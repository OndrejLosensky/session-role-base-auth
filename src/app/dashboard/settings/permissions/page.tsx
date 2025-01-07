import { getUser } from "@/app/utils/getUser";
import { Permission } from "@/app/utils/types";
import { hasPermission } from "@/lib/permissions";
import { PermissionsList } from "@/app/components/PermissionsList";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getAllPermissionsNumber } from "@/app/utils/all";

async function getAllPermissions() {
  return prisma.permission.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      roles: {
        select: {
          id: true,
          name: true,
        }
      }
    }
  });
}

export default async function PermissionsPage() {
  const user = await getUser();
  const canManagePermissions = await hasPermission(user.id, Permission.MANAGE_SETTINGS);

  if (!canManagePermissions) {
    return (
      <div>
        Insufficient permissions: {Permission.MANAGE_SETTINGS}
      </div>
    );
  }

  const permissions = await getAllPermissions();
  const permissionsCount = await getAllPermissionsNumber();

  return (
    <div className="p-6 w-full">
      <div className="mb-6">
        <Link
          href="/dashboard/settings"
          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          ← Back to Dashboard
        </Link>
      </div>
      <div className="">
        <h1 className="text-2xl font-bold mb-6">Permissions Management</h1>
        <PermissionsList 
          permissions={permissions}
          canManagePermissions={canManagePermissions}
          permissionsCount={permissionsCount}
        />
      </div>
    </div>
  );
}