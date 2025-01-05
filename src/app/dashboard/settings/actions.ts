'use server'

import { Permission } from "@/app/utils/types";
import { createAuditLog } from "@/lib/audit-logger";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from 'zod';
import { getUser } from "../../utils/getUser";

const createRoleSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  description: z.string().optional(),
  permissions: z.array(z.string()),
});

const updateRoleSchema = createRoleSchema.extend({
  id: z.string(),
});

type RoleState = {
  errors?: {
    name?: string[];
    description?: string[];
    permissions?: string[];
    _form?: string[];
  };
  success?: boolean;
};

export async function updateUserRole(
  currentUserId: string, 
  userId: string, 
  roleId: string
) {
  const canManageRoles = await hasPermission(currentUserId, Permission.MANAGE_ROLES);
  
  if (!canManageRoles) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { roleId },
    include: {
      role: true
    }
  });

  await createAuditLog({
    action: 'UPDATE_USER',
    userId: currentUserId,
    details: {
      updatedUserId: userId,
      newRole: user.role.name
    }
  });

  revalidatePath('/dashboard');
  
  return user;
}

export async function getAllRoles() {
  return prisma.role.findMany({
    include: {
      permissions: true
    }
  });
}

export async function createRole(prevState: RoleState, formData: FormData) {
  const user = await getUser();
  const canManageRoles = await hasPermission(user.id, Permission.MANAGE_ROLES);
  
  if (!canManageRoles) {
    return {
      errors: {
        _form: ['Unauthorized to create roles'],
      },
    };
  }

  const validatedFields = createRoleSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    permissions: formData.getAll('permissions'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, description, permissions } = validatedFields.data;

  try {
    const role = await prisma.role.create({
      data: {
        name: name.toUpperCase(),
        description,
        permissions: {
          connect: permissions.map(permission => ({
            name: permission
          }))
        }
      },
    });

    await createAuditLog({
      action: 'CREATE_ROLE',
      userId: user.id, // Changed from 'system' to actual user.id
      details: {
        roleId: role.id,
        roleName: role.name,
      },
    });

    revalidatePath('/admin');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to create role:', error);
    return {
      errors: {
        _form: ['Failed to create role. Please try again.'],
      },
    };
  }
}

export async function updateRole(prevState: RoleState, formData: FormData) {
  const validatedFields = updateRoleSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    description: formData.get('description'),
    permissions: formData.getAll('permissions'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, name, description, permissions } = validatedFields.data;

  try {
    const role = await prisma.role.update({
      where: { id },
      data: {
        name: name.toUpperCase(),
        description,
        permissions: {
          set: [],
          connect: permissions.map(permission => ({
            name: permission
          }))
        }
      },
    });

    await createAuditLog({
      action: 'UPDATE_ROLE',
      userId: 'system',
      details: {
        roleId: role.id,
        roleName: role.name,
      },
    });

    revalidatePath('/dashboard');
    
    return { success: true };
  } catch {
    return {
      errors: {
        _form: ['Failed to update role. Please try again.'],
      },
    };
  }
}

export async function getAllPermissions() {
  return prisma.permission.findMany({
    select: {
      id: true,
      name: true,
      description: true,
    },
  });
}

export async function deleteRole(id: string): Promise<{ success: boolean; error?: string }> {
  const user = await getUser();
  const canManageRoles = await hasPermission(user.id, Permission.MANAGE_ROLES);
  
  if (!canManageRoles) {
    return {
      success: false,
      error: 'Unauthorized to delete roles',
    };
  }

  try {
    await prisma.role.delete({
      where: { id },
    });

    await createAuditLog({
      action: 'DELETE_ROLE',
      userId: user.id,
      details: {
        roleId: id,
      },
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete role:', error);
    return {
      success: false,
      error: 'Failed to delete role. Make sure no users are assigned to this role.',
    };
  }
} 