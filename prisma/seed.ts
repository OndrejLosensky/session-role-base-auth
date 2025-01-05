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
  MANAGE_PERMISSIONS: 'manage_permissions',
  
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
  console.log('🌱 Starting database seed...');

  // Create basic permissions
  console.log('Creating permissions...');
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
  console.log('✅ Permissions created');

  // Create default USER role
  console.log('Creating USER role...');
  await prisma.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: {
      name: 'USER',
      description: 'Basic user access',
      permissions: {
        connect: [
          { name: Permission.READ_CONTENT },
        ]
      }
    }
  });
  console.log('✅ USER role created');

  // Create ADMIN role
  console.log('Creating ADMIN role...');
  await prisma.role.upsert({
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
  console.log('✅ ADMIN role created');

  // Create default admin user
  console.log('Creating default admin user...');
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
  console.log('✅ Admin user created');

  console.log('✨ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });