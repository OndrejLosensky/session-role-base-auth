import { getUser } from "@/app/utils/getUser";
import { Permission } from "@/app/utils/types";
import { hasPermission } from "@/lib/permissions";
import { EditUserProfileForm } from "@/app/components/EditUserProfileForm";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ProfilePage() {
  const user = await getUser();
  const canEditProfile = await hasPermission(user.id, Permission.EDIT_OWN_PROFILE);

  if (!canEditProfile) {
    redirect("/unauthorized");
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/admin"
          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          ← Back to Dashboard
        </Link>
      </div>
      
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
        <EditUserProfileForm user={{ ...user, role: { ...user.role, description: user.role.description ?? undefined } }} />
      </div>
    </div>
  );
}