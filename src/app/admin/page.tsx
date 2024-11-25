import { getUser } from "@/app/utils/getUser";
import { UsersList } from "@/app/components/UsersList";
import { checkUserPermissions } from "@/lib/permissions";
import { ProfileAvatar } from "../components/ProfileAvatar";
import { RolesList } from "@/app/components/RolesList";
import { PermissionsList } from "@/app/components/PermissionsList";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { getAllRolesNumber, getAllPermissionsNumber, getAllUsersNumber } from "../utils/all";
import { getAllUsers, getAllRoles, getAllPermissions } from "./_actions/dataFetching";

export default async function Admin() {
  const user = await getUser();
  const { canViewUsers, canManageRoles, canCreateUser, canManagePermissions } = await checkUserPermissions(user.id);

  const allUsers = canViewUsers ? await getAllUsers(3) : [];
  const roles = canViewUsers ? await getAllRoles(3) : [];
  const permissions = canViewUsers ? await getAllPermissions(3) : [];

  const usersCount = await getAllUsersNumber();
  const rolesCount = await getAllRolesNumber();
  const permissionsCount = await getAllPermissionsNumber();

  return (
    <div>
      <div className="p-8 bg-neutral-100">
        <h1 className="text-2xl font-bold mb-6">
          Welcome 👋, {user.name || user.email}!
        </h1>

        <div className="bg-white shadow-md rounded-lg p-6">
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

        {canViewUsers && allUsers.length > 0 && (
          <div className="bg-white shadow-md rounded-lg p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Users</h2>
              <Link
                href="/admin/users"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
              >
                View All <FiArrowRight />
              </Link>
            </div>
            <UsersList
              users={allUsers}
              roles={roles}
              currentUserId={user.id}
              canCreateUser={canCreateUser}
              usersCount={usersCount}
            />
          </div>
        )}

        {canViewUsers && allUsers.length > 0 && (
          <div className="bg-white shadow-md rounded-lg p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Roles</h2>
              <Link
                href="/admin/roles"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
              >
                View All <FiArrowRight />
              </Link>
            </div>
            <RolesList
              roles={roles}
              canManageRoles={canManageRoles}
              rolesCount={rolesCount}
              showViewAll={true}
            />
          </div>
        )}

        {canViewUsers && allUsers.length > 0 && (
          <div className="bg-white shadow-md rounded-lg p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Permissions</h2>
              <Link
                href="/admin/permissions"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
              >
                View All <FiArrowRight />
              </Link>
            </div>
            <PermissionsList
              permissions={permissions}
              canManagePermissions={canManagePermissions}
              permissionsCount={permissionsCount}
            />
          </div>
        )}
      </div>
    </div>
  );
}
