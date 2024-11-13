import { getUser } from "@/app/utils/getUser";
import { Permission } from "@/app/utils/types";
import { hasPermission } from "@/lib/permissions";
import { AuditLogsList } from "@/app/components/AuditLogsList";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getAuditLogs() {
  return prisma.auditLog.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    take: 100
  });
}

export default async function LogsPage() {
  const user = await getUser();
  const canViewLogs = await hasPermission(user.id, Permission.VIEW_AUDIT_LOGS);

  if (!canViewLogs) {
    return null;
  }

  const logs = await getAuditLogs();

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
      
      <div className="max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">Audit Logs</h1>
        <AuditLogsList logs={logs} />
      </div>
    </div>
  );
} 