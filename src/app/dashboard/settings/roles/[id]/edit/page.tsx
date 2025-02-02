import { getUser } from "@/app/utils/getUser";
import { Permission } from "@/app/utils/types";
import { hasPermission } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { RoleForm } from "@/app/components/RoleForm";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

interface EditRolePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditRolePage(props: EditRolePageProps) {
  const params = await props.params;
  const user = await getUser();
  const canManageRoles = await hasPermission(user.id, Permission.MANAGE_SETTINGS);

  if (!canManageRoles) {
    redirect("/unauthorized");
  }

  const [role, permissions] = await Promise.all([
    prisma.role.findUnique({
      where: { id: params.id },
      include: { permissions: true }
    }),
    prisma.permission.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      }
    })
  ]);

  if (!role) {
    redirect("/dashboard");
  }

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
        <h1 className="text-2xl font-bold mb-6">Edit Role</h1>
        <RoleForm role={role} permissions={permissions} />
      </div>
    </div>
  );
} 