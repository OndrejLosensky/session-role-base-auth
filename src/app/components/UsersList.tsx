import { ProfileAvatar } from "./ProfileAvatar";

interface UserListItem {
  id: string;
  email: string;
  name: string | null;
  role: string;
  profilePicture: string | null;
  profileColor: string | null;
  createdAt: Date;
}

interface UsersListProps {
  users: UserListItem[];
}

export function UsersList({ users }: UsersListProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">All Users ({users.length})</h2>
      <div className="divide-y">
        {users.map((user) => (
          <div key={user.id} className="py-4 flex items-center gap-4">
            <ProfileAvatar
              profilePicture={user.profilePicture}
              profileColor={user.profileColor}
              name={user.name || user.email}
              size="sm"
            />
            <div className="flex-1">
              <p className="font-semibold">{user.name || user.email}</p>
              <p className="text-sm text-gray-600 capitalize">{user.role.toLowerCase()}</p>
            </div>
            <div className="text-sm text-gray-500">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 