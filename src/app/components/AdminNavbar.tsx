"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserMenu } from "./UserMenu";
import { User } from "../utils/types";
import { DashboardFeatureFlag, isFeatureEnabled } from "../utils/featureFlags";

interface AdminNavbarProps {
  user?: User;
  canManageUserData?: boolean;
  canViewSettings?: boolean;
  canViewProfile?: boolean;  
}

export function AdminNavbar({
  user,
  canManageUserData,
  canViewSettings,
  canViewProfile,
}: AdminNavbarProps) {
  const pathname = usePathname();

  if (!user) return null;

  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true;
    }
    if (path !== "/dashboard" && pathname.startsWith(path)) {
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
    <nav className="sticky top-0 bg-white shadow-xs px-4 py-2 w-screen">
      <div className="flex items-center justify-between flex-row">
        <div className="flex items-center space-x-1">
          <Link href="/dashboard" className={linkClass("/dashboard")}>
            Dashboard
          </Link>

          <Link href="/dashboard/history" className={linkClass("/dashboard/history")}>
            History
          </Link>

          {isFeatureEnabled(DashboardFeatureFlag.PROFILE) && canViewProfile && (
            <Link
              href="/dashboard/profile"
              className={linkClass("/dashboard/profile")}
            >
              Profile
            </Link>
          )}
          {isFeatureEnabled(DashboardFeatureFlag.SETTINGS) &&
            canViewSettings && (
              <Link
                href="/dashboard/settings"
                className={linkClass("/dashboard/settings")}
              >
                Settings
              </Link>
            )}
        </div>
        {isFeatureEnabled(DashboardFeatureFlag.USER_MENU) && canManageUserData && (
          <UserMenu
            user={{
              ...user,
              role: user.role.name,
              profilePicture: user.profilePicture ?? null,
              profileColor: user.profileColor ?? null,
            }}
          />
        )}
      </div>
    </nav>
  );
}
