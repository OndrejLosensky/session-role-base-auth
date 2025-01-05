import Link from "next/link";

export default async function SettingsPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/dashboard/settings/logs" className="block p-4 border rounded-lg shadow hover:bg-gray-100 transition">
                    <h2 className="text-lg font-semibold">Audit Logs</h2>
                    <p className="text-gray-600">View and manage audit logs.</p>
                </Link>
                <Link href="/dashboard/settings/permissions" className="block p-4 border rounded-lg shadow hover:bg-gray-100 transition">
                    <h2 className="text-lg font-semibold">Permissions</h2>
                    <p className="text-gray-600">Manage user permissions.</p>
                </Link>
                <Link href="/dashboard/settings/roles" className="block p-4 border rounded-lg shadow hover:bg-gray-100 transition">
                    <h2 className="text-lg font-semibold">Roles</h2>
                    <p className="text-gray-600">Manage user roles and their permissions.</p>
                </Link>
                <Link href="/dashboard/settings/users" className="block p-4 border rounded-lg shadow hover:bg-gray-100 transition">
                    <h2 className="text-lg font-semibold">Users</h2>
                    <p className="text-gray-600">Manage user accounts.</p>
                </Link>
            </div>
        </div>
    );
}