 "use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserMenu } from "./UserMenu";
import { User } from "../utils/types";

interface AdminNavbarProps {
    user?: User;
    canViewUsers?: boolean;
    canManageRoles?: boolean;
    canManagePermissions?: boolean;
    canViewLogs?: boolean;
  }

export function AdminNavbar({ user, canViewUsers, canManageRoles, canManagePermissions, canViewLogs }: AdminNavbarProps) {
  const pathname = usePathname();

  if (!user) return null;


  const isActive = (path: string) => {
    if (path === '/admin' && pathname === '/admin') {
      return true;
    }
    if (path !== '/admin' && pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm transition-colors ${
      isActive(path)
        ? "bg-gray-100 text-gray-900 font-medium"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
    }`;

  return (
    <nav className="sticky top-0 bg-white shadow-md px-8 py-2 w-screen">
      <div className="flex items-center justify-between flex-row">
        <div className="flex items-center space-x-1">
          <Link 
            href="/admin" 
            className={linkClass('/admin')}
          >
            Dashboard
          </Link>
          {canViewUsers && (
            <Link 
              href="/admin/users" 
              className={linkClass('/admin/users')}
            >
              Users
            </Link>
          )}
          {canManageRoles && (
            <Link 
              href="/admin/roles" 
              className={linkClass('/admin/roles')}
            >
              Roles
            </Link>
          )}
          {canManagePermissions && (
            <Link 
              href="/admin/permissions" 
              className={linkClass('/admin/permissions')}
            >
              Permissions
            </Link>
          )}
          {canViewLogs && (
            <Link 
              href="/admin/logs" 
              className={linkClass('/admin/logs')}
            >
              Audit Logs
            </Link>
          )}
        </div>
        <UserMenu user={{
          ...user,
          role: user.role.name,
          profilePicture: user.profilePicture ?? null,
          profileColor: user.profileColor ?? null
        }} />
      </div>
    </nav>
  );
}