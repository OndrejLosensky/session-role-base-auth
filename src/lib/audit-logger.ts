import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"

export type AuditLogAction = 
  // Authentication
  | 'LOGIN'
  | 'REGISTER'
  | 'LOGOUT'
  | 'PASSWORD_RESET'
  | 'PASSWORD_CHANGE'
  
  // User Management
  | 'CREATE_USER'
  | 'UPDATE_USER'
  | 'DELETE_USER'
  | 'UPDATE_PROFILE'
  
  // Role Management
  | 'CREATE_ROLE'
  | 'UPDATE_ROLE'
  | 'DELETE_ROLE'
  | 'ASSIGN_ROLE'
  
  // Permission Management
  | 'GRANT_PERMISSION'
  | 'REVOKE_PERMISSION'
  | 'CREATE_PERMISSION'
  | 'UPDATE_PERMISSION'
  | 'DELETE_PERMISSION'
  // Content Management
  | 'CREATE_POST'
  | 'UPDATE_POST'
  | 'DELETE_POST'
  | 'PUBLISH_POST'
  | 'UNPUBLISH_POST'
  
  // System Events
  | 'SYSTEM_ERROR'
  | 'CONFIGURATION_CHANGE'
  | 'AUDIT_LOG_VIEW'

export async function createAuditLog({
  action,
  userId,
  details
}: {
  action: AuditLogAction
  userId: string
  details?: Record<string, unknown>
}) {
  try {
    const headersList = await headers()
    
    await prisma.auditLog.create({
      data: {
        action,
        userId,
        details: JSON.stringify(details || {}),
        ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip'),
        userAgent: headersList.get('user-agent'),
      }
    })
  } catch (error) {
    console.error('Failed to create audit log:', error)
  }
} 