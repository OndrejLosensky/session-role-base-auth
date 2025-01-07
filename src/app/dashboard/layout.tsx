import { getUser } from "@/app/utils/getUser";
import { Permission } from "@/app/utils/types";
import { hasPermission } from "@/lib/permissions";
import { AdminNavbar } from "../components/AdminNavbar";
import { DashboardFeatureFlag, isFeatureEnabled } from "../utils/featureFlags";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
   
  const canManageUserData = await hasPermission(user.id, Permission.CREATE_USER && Permission.DELETE_USER || Permission.MANAGE_SETTINGS);
  const canViewSettings = await hasPermission(user.id, Permission.MANAGE_SETTINGS);
  const canViewProfile = await hasPermission(user.id, Permission.VIEW_PROFILE);

  return (
    <>
      {isFeatureEnabled(DashboardFeatureFlag.ADMIN_NAVBAR) && (
        <AdminNavbar 
          user={user}         
          canManageUserData={canManageUserData}
          canViewSettings={canViewSettings}
          canViewProfile={canViewProfile}
        />
      )}
      <div className="p-4">
        {children}
      </div>
    </>
  );
}
