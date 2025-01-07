import { getUser } from "@/app/utils/getUser";
import { Permission } from "@/app/utils/types";
import { hasPermission } from "@/lib/permissions";
import { EditUserProfileForm } from "@/app/components/EditUserProfileForm";
import Link from "next/link";
import { ProfileAvatar } from "../../components/ProfileAvatar";
import {
  DashboardFeatureFlag,
  isFeatureEnabled,
} from "../../utils/featureFlags";

export default async function ProfilePage() {
  const user = await getUser();
  const canEditProfile = await hasPermission(
    user.id,
    Permission.MANAGE_SETTINGS
  );

  if (!canEditProfile) {
    return (
      <div>
        Insufficient permissions: {Permission.MANAGE_SETTINGS}
      </div>
    );
  }

  return (
    <>
      {isFeatureEnabled(DashboardFeatureFlag.PROFILE) ? (
        <div className="p-8 flex flex-row w-screen">
          <div className="w-1/2">
            <div className="mb-6">
              <Link
                href="/dashboard"
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                ← Back to Dashboard
              </Link>
            </div>

            <div className="max-w-2xl">
              <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
              <EditUserProfileForm
                user={{
                  ...user,
                  role: {
                    ...user.role,
                    description: user.role.description || null,
                  },
                }}
              />
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 w-1/2">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>

            <div className="grid gap-4">
              <div className="mb-4">
                <ProfileAvatar
                  profilePicture={user.profilePicture}
                  profileColor={user.profileColor}
                  name={user.name || user.email}
                  size="lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-600 text-sm">ID</label>
                  <p className="font-mono">{user.id}</p>
                </div>

                <div>
                  <label className="text-gray-600 text-sm">Email</label>
                  <p>{user.email}</p>
                </div>

                <div>
                  <label className="text-gray-600 text-sm">Name</label>
                  <p>{user.name || "Not set"}</p>
                </div>

                <div>
                  <label className="text-gray-600 text-sm">Role</label>
                  <p className="capitalize">{user.role.name.toLowerCase()}</p>
                </div>

                <div>
                  <label className="text-gray-600 text-sm">Created At</label>
                  <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>

                <div>
                  <label className="text-gray-600 text-sm">Last Updated</label>
                  <p>{new Date(user.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mt-4">
                <Link
                  href="/admin/profile"
                  className="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8">
          <h1 className="text-xl font-bold">Feature Not Available</h1>
          <p>This feature is not done yet. Please check back later.</p>
        </div>
      )}
    </>
  );
}
