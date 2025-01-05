import { getUser } from "@/app/utils/getUser";

export default async function Admin() {
  const user = await getUser();
  return (
    <div>
      <div className="p-4">
        <h1 className="text-2xl font-bold">
          Welcome 👋, {user.name || user.email}!
        </h1>
      <p className="text-sm text-gray-600 mt-4">
        To get started, consider editing the layout.tsx and page.tsx files to achieve some styling or check the documentation for more information.
      </p>
      </div>
    </div>
  );
}
