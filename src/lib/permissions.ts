import { Permission } from '@/app/utils/types';
import { prisma } from './prisma';

export async function hasPermission(userId: string, permission: Permission): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: {
        include: {
          permissions: true
        }
      }
    }
  });

  if (!user) return false;

  return user.role.permissions.some(p => p.name === permission);
}

export async function hasPermissions(userId: string, permissions: Permission[]): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: {
        include: {
          permissions: true
        }
      }
    }
  });

  if (!user) return false;

  return permissions.every(permission => 
    user.role.permissions.some(p => p.name === permission)
  );
} 