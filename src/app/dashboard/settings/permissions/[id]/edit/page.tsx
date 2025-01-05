import { getUser } from "@/app/utils/getUser";
import { Permission } from "@/app/utils/types";
import { hasPermission } from "@/lib/permissions";
import { PermissionForm } from "@/app/components/PermissionForm";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

interface EditPermissionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPermissionPage({ params }: EditPermissionPageProps) {
  const { id } = await params;
  const user = await getUser();
  const canManagePermissions = await hasPermission(user.id, Permission.MANAGE_PERMISSIONS);

  if (!canManagePermissions) {
    redirect("/unauthorized");
  }

  const permission = await prisma.permission.findUnique({
    where: { id },
  });

  if (!permission) {
    redirect("/dashboard");
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
        <h1 className="text-2xl font-bold mb-6">Edit Permission</h1>
        <PermissionForm permission={permission} />
      </div>
    </div>
  );
}