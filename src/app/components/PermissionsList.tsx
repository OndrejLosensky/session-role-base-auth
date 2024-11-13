import Link from "next/link";

interface Permission {
  id: string;
  name: string;
  description: string | null;
}

interface PermissionsListProps {
  permissions: Permission[];
  canManagePermissions: boolean;
}

export function PermissionsList({
  permissions,
  canManagePermissions,
}: PermissionsListProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          All Permissions ({permissions.length})
        </h2>
        {canManagePermissions && (
          <Link
            href="/admin/permissions/add"
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
          >
            Add New Permission
          </Link>
        )}
      </div>
      <div className="divide-y">
        {permissions.map((permission) => (
          <div key={permission.id} className="py-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{permission.name}</h3>
                {permission.description && (
                  <p className="text-sm text-gray-600">
                    {permission.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
