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
  currentPassword: z.string().min(6).optional(),
  newPassword: z.string().min(6).optional(),
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
  const canEditProfile = await hasPermission(user.id, Permission.EDIT_OWN_PROFILE);

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
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, currentPassword, newPassword } = validatedFields.data;

  try {
    // Check if email is already taken by another user
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
      name,
      email,
    };

    // If changing password, verify current password
    if (currentPassword && newPassword) {
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

    revalidatePath('/profile');
    revalidatePath('/admin');

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