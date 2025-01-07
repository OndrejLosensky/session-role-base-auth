'use server'

import { getUser } from "@/app/utils/getUser";
import { Permission } from "@/app/utils/types";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit-logger";
import { revalidatePath } from "next/cache";
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const updateProfileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }).optional(),
  email: z.string().email({ message: 'Invalid email address' }),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6).optional(),
}).refine((data) => {
  // If either password field is provided, both must be provided
  const hasCurrentPassword = !!data.currentPassword?.trim();
  const hasNewPassword = !!data.newPassword?.trim();
  
  if (hasCurrentPassword || hasNewPassword) {
    return hasCurrentPassword && hasNewPassword;
  }
  return true;
}, {
  message: "Both current and new password must be provided to change password",
  path: ["currentPassword"],
});

type ProfileUpdateState = {
  errors?: {
    name?: string[];
    email?: string[];
    currentPassword?: string[];
    newPassword?: string[];
    _form?: string[];
  };
  success?: boolean;
};

export async function updateUserProfile(
  prevState: ProfileUpdateState,
  formData: FormData
): Promise<ProfileUpdateState> {
  const user = await getUser();
  const canEditProfile = await hasPermission(user.id, Permission.VIEW_PROFILE);

  if (!canEditProfile) {
    return {
      errors: {
        _form: ['You do not have permission to edit your profile'],
      },
    };
  }

  const validatedFields = updateProfileSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    currentPassword: formData.get('currentPassword')?.toString() || undefined,
    newPassword: formData.get('newPassword')?.toString() || undefined,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, currentPassword, newPassword } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          id: user.id
        }
      }
    });

    if (existingUser) {
      return {
        errors: {
          email: ['Email is already taken'],
        },
      };
    }
    
    const updateData: {
      name?: string;
      email: string;
      password?: string;
    } = {
      email,
    };

    if (name?.trim()) {
      updateData.name = name;
    }

    if (currentPassword?.trim() && newPassword?.trim()) {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { password: true }
      });

      if (!dbUser || !await bcrypt.compare(currentPassword, dbUser.password)) {
        return {
          errors: {
            currentPassword: ['Current password is incorrect'],
          },
        };
      }

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    await createAuditLog({
      action: 'UPDATE_PROFILE',
      userId: user.id,
      details: {
        updatedFields: Object.keys(updateData),
      },
    });

    revalidatePath('/dashboard/profile');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Profile update error:', error);
    return {
      errors: {
        _form: ['Failed to update profile'],
      },
    };
  }
} 