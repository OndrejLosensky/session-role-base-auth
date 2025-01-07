"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserMenu } from "./UserMenu";
import { User } from "../utils/types";
import { DashboardFeatureFlag, isFeatureEnabled } from "../utils/featureFlags";
import { FaTachometerAlt, FaUsers, FaBeer, FaHistory, FaUser, FaCog } from 'react-icons/fa';

import data from "@/resources.json";

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
    <nav className="sticky top-0 bg-white shadow-sm px-4 w-screen">
      <div className="flex items-center justify-between flex-row">
        <div className="flex items-center space-x-1">
          <Link href="/dashboard" className={linkClass("/dashboard")}>
            <FaTachometerAlt className="inline-block mr-1" /> {data.dashboard.links.dashboard}
          </Link>

          <Link
            href="/dashboard/uzivatele"
            className={linkClass("/dashboard/uzivatele")}
          >
            <FaUsers className="inline-block mr-1" />  {data.dashboard.links.users}
          </Link>

          <Link href="/dashboard/sudy" className={linkClass("/dashboard/sudy")}>
            <FaBeer className="inline-block mr-1" />  {data.dashboard.links.jugs}
          </Link>

          <Link href="/dashboard/historie" className={linkClass("/dashboard/historie")}>
            <FaHistory className="inline-block mr-1" />  {data.dashboard.links.history}
          </Link>

          {isFeatureEnabled(DashboardFeatureFlag.PROFILE) && canViewProfile && (
            <Link
              href="/dashboard/profile"
              className={linkClass("/dashboard/profile")}
            >
              <FaUser className="inline-block mr-1" />  {data.dashboard.links.profile}
            </Link>
          )}
          {isFeatureEnabled(DashboardFeatureFlag.SETTINGS) &&
            canViewSettings && (
              <Link
                href="/dashboard/settings"
                className={linkClass("/dashboard/settings")}
              >
                <FaCog className="inline-block mr-1" /> {data.dashboard.links.settings}
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
