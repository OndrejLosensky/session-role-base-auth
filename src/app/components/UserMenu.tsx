"use client";

import { useState, useRef, useEffect } from "react";
import { ProfileAvatar } from "./ProfileAvatar";
import { LogoutButton } from "./LogoutButton";
import Link from "next/link";

interface UserMenuProps {
  user?: {
    name: string | null;
    email: string;
    role: string;
    profilePicture: string | null;
    profileColor: string | null;
  };
  canViewDashboard?: boolean;
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-4 hover:bg-blue-600 bg-blue-500 text-white duration-150 p-2 px-4 rounded-lg transition-colors"
      >
        <span className="font-semibold">Sign in</span>
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-4 hover:bg-gray-100 duration-150 py-2 px-4 rounded-lg transition-colors"
      >
        <ProfileAvatar
          profilePicture={user.profilePicture}
          profileColor={user.profileColor}
          name={user.name || user.email}
          size="sm"
        />

        <div className="text-left">
          <p className="font-semibold text-sm">{user.name || user.email}</p>
          <p className="text-xs text-gray-600 capitalize">{user.role}</p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium">{user.name || user.email}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          {(
            <div className="px-4 py-2 border-b">
              <Link href="/dashboard">
                <p className="text-sm font-medium">Dashboard</p>
              </Link>
            </div>
          )}
          <div className="px-4 py-2 border-b">
            <Link href="/">
              <p className="text-sm font-medium">Homepage</p>
            </Link>
          </div>
          <div className="px-4 py-2 border-b">
            <LogoutButton />
          </div>
        </div>
      )}
    </div>
  );
}
