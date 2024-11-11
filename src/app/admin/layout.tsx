export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex h-screen bg-gray-100">{children}</div>;
}
