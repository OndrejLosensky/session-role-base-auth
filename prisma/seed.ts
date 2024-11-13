/*
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

// Define permissions enum directly in the seed file
const Permission = {
  // User Management
  CREATE_USER: 'create_user',
  READ_USER: 'read_user',
  UPDATE_USER: 'update_user',
  DELETE_USER: 'delete_user',
  
  // Role Management
  MANAGE_ROLES: 'manage_roles',
  
  // Content Management
  CREATE_CONTENT: 'create_content',
  READ_CONTENT: 'read_content',
  UPDATE_CONTENT: 'update_content',
  DELETE_CONTENT: 'delete_content',
  
  // System Management
  VIEW_AUDIT_LOGS: 'view_audit_logs',
  MANAGE_SETTINGS: 'manage_settings'
} as const;

async function main() {
  // Create basic permissions
  const permissions = Object.values(Permission);
  await Promise.all(
    permissions.map(permission =>
      prisma.permission.upsert({
        where: { name: permission },
        update: {},
        create: {
          name: permission,
          description: `Permission to ${permission.toLowerCase().replace('_', ' ')}`
        }
      })
    )
  );

  // Create default USER role with fixed ID
  await prisma.role.upsert({
    where: { id: 'user' },
    update: {},
    create: {
      id: 'user', 
      name: 'USER',
      description: 'Basic user access',
      permissions: {
        connect: [
          { name: Permission.READ_CONTENT },
        ]
      }
    }
  });

  // Create ADMIN role
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'Full system access',
      permissions: {
        connect: permissions.map(permission => ({ name: permission }))
      }
    }
  });

  // Create default admin user
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: await hash('admin123', 10),
      name: 'Admin User',
      role: {
        connect: {
          name: 'ADMIN'
        }
      }
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
*/