import { getUser } from "@/app/utils/getUser";
import { Permission } from "@/app/utils/types";
import { hasPermission } from "@/lib/permissions";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
    const user = await getUser();
    const canManageSettings = await hasPermission(user.id, Permission.MANAGE_SETTINGS);

    if (!canManageSettings) {
        redirect("/dashboard");
    }

    const links = [
        { href: "/dashboard/settings/users", title: "Users", description: "Manage user accounts." },
        { href: "/dashboard/settings/roles", title: "Roles", description: "Manage user roles and their permissions." },
        { href: "/dashboard/settings/permissions", title: "Permissions", description: "Manage user permissions." },
        { href: "/dashboard/settings/logs", title: "Audit Logs", description: "View and manage audit logs." },
    ];

    return (
        <div className="p-6">            
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {links.map(link => (
                    <Link key={link.href} href={link.href} className="block p-4 border rounded-lg shadow-sm hover:bg-gray-100 transition">
                        <h2 className="text-lg font-semibold">{link.title}</h2>
                        <p className="text-gray-600">{link.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}