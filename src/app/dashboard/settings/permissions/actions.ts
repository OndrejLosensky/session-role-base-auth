'use server'

import { Permission } from "@/app/utils/types";
import { createAuditLog } from "@/lib/audit-logger";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from 'zod';
import { getUser } from "@/app/utils/getUser";

const createPermissionSchema = z.object({
  name: z.string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .regex(/^[a-z_]+$/, { message: 'Name must be lowercase with underscores only' }),
  description: z.string().optional(),
});

const updatePermissionSchema = z.object({
  id: z.string(), // Remove UUID validation since Prisma handles ID format
  name: z.string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .regex(/^[a-z_]+$/, { message: 'Name must be lowercase with underscores only' }),
  description: z.string().optional(),
});

type PermissionState = {
  errors?: {
    name?: string[];
    description?: string[];
    _form?: string[];
  };
  success?: boolean;
};

export async function createPermission(prevState: PermissionState, formData: FormData): Promise<PermissionState> {
  const user = await getUser();
  const canManageRoles = await hasPermission(user.id, Permission.MANAGE_SETTINGS);
  
  if (!canManageRoles) {
    return {
      errors: {
        _form: ['Unauthorized to create permissions'],
      },
    };
  }

  const validatedFields = createPermissionSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, description } = validatedFields.data;

  try {
    const permission = await prisma.permission.create({
      data: {
        name,
        description,
      },
    });

    await createAuditLog({
      action: 'CREATE_PERMISSION',
      userId: user.id,
      details: {
        permissionId: permission.id,
        permissionName: permission.name,
      },
    });

    revalidatePath('/dashboard');

    return { success: true };
  } catch {
    return {
      errors: {
        _form: ['Failed to create permission'],
      },
    };
  }
}

export async function updatePermission(prevState: PermissionState, formData: FormData): Promise<PermissionState> {
  const user = await getUser();
  const canManagePermissions = await hasPermission(user.id, Permission.MANAGE_SETTINGS);
  
  if (!canManagePermissions) {
    return {
      success: false,
      errors: {
        _form: ['Unauthorized to update permissions'],
      },
    };
  }

  const validatedFields = updatePermissionSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, name, description } = validatedFields.data;

  try {
    const updatedPermission = await prisma.permission.update({
      where: { id },
      data: {
        name,
        description,
      },
    });

    await createAuditLog({
      action: 'UPDATE_PERMISSION',
      userId: user.id,
      details: {
        permissionId: updatedPermission.id,
        permissionName: updatedPermission.name,
      },
    });

    revalidatePath('/dashboard');
    
    return { 
      success: true,
      errors: undefined
    };
  } catch (error) {
    console.error('Failed to update permission:', error);
    return {
      success: false,
      errors: {
        _form: ['Failed to update permission. Please try again.'],
      },
    };
  }
}

export async function deletePermission(id: string): Promise<{ success: boolean; error?: string }> {
  const user = await getUser();
  const canManagePermissions = await hasPermission(user.id, Permission.MANAGE_SETTINGS);
  
  if (!canManagePermissions) {
    return {
      success: false,
      error: 'Unauthorized to delete permissions',
    };
  }

  try {
    await prisma.permission.delete({
      where: { id },
    });

    await createAuditLog({
      action: 'DELETE_PERMISSION',
      userId: user.id,
      details: {
        permissionId: id,
      },
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete permission:', error);
    return {
      success: false,
      error: 'Failed to delete permission',
    };
  }
}