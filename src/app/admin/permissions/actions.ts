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
  const canManageRoles = await hasPermission(user.id, Permission.MANAGE_ROLES);
  
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

    revalidatePath('/admin');

    return { success: true };
  } catch {
    return {
      errors: {
        _form: ['Failed to create permission'],
      },
    };
  }
} 