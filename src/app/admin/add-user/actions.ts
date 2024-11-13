'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createAuditLog } from '@/lib/audit-logger';
import { getUser } from '@/app/utils/getUser';
import { Permission } from '@/app/utils/types';
import { hasPermission } from '@/lib/permissions';
import { revalidatePath } from 'next/cache';

const createUserSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  roleId: z.string(),
  profileColor: z.string(),
});

type State = {
  errors?: {
    email?: string[];
    password?: string[];
    name?: string[];
    roleId?: string[];
    profileColor?: string[];
  };
  success?: boolean;
};

export async function createUser(prevState: State, formData: FormData): Promise<State> {
  const user = await getUser();
  const canCreateUser = await hasPermission(user.id, Permission.CREATE_USER);
  
  if (!canCreateUser) {
    return {
      errors: {
        email: ["You don't have permission to create users"],
      },
    };
  }

  const validatedFields = createUserSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    name: formData.get('name'),
    roleId: formData.get('roleId'),
    profileColor: formData.get('profileColor'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, name, roleId, profileColor } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        errors: {
          email: ["User with this email already exists"],
        },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        roleId,
        profileColor,
      },
    });

    await createAuditLog({
      action: 'CREATE_USER',
      userId: user.id,
      details: {
        createdUserId: newUser.id,
        email: newUser.email,
      },
    });

    revalidatePath('/admin');
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Failed to create user:', error);
    return {
      errors: {
        email: ['Failed to create user. Please try again.'],
      },
    };
  }
} 