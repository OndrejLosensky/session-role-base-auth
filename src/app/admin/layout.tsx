import { getUser } from "@/app/utils/getUser";
import { Permission } from "@/app/utils/types";
import { hasPermission } from "@/lib/permissions";
import { AdminNavbar } from "../components/AdminNavbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  const canViewUsers = await hasPermission(user.id, Permission.READ_USER);
  const canManageRoles = await hasPermission(user.id, Permission.MANAGE_ROLES);
  const canManagePermissions = await hasPermission(user.id, Permission.MANAGE_PERMISSIONS);
  const canViewLogs = await hasPermission(user.id, Permission.VIEW_AUDIT_LOGS);

  return (
    <>
      <AdminNavbar 
        user={user}
        canViewUsers={canViewUsers}
        canManageRoles={canManageRoles}
        canManagePermissions={canManagePermissions}
        canViewLogs={canViewLogs}
      />
      {children}
    </>
  );
}
