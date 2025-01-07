"use server";

import { z } from "zod";
import { createSession, deleteSession } from "@/lib/sessions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createAuditLog } from "@/lib/audit-logger";
import { addMinutes } from "date-fns";
import { Permission } from "../utils/types";
import { hasPermission } from "@/lib/permissions";

const loginSchema = z.object({
  email: z.string({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters" })
    .trim(),
});

type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
};

const MAX_FAILED_ATTEMPTS = 555;
const LOCK_TIME_MINUTES = 1;

export async function login(prevState: LoginState | undefined, formData: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data;

  // Find user in database with role
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      role: {
        include: {
          permissions: true
        }
      }
    }
  });

  // Check if user exists and if account is locked
  if (user) {
    const now = new Date();
    if (user.lockUntil && user.lockUntil > now) {
      return {
        errors: {
          email: ["Account is locked. Please try again later."],
        },
      };
    }
  }

  // Check if user exists and password matches
  const passwordMatch = user ? await bcrypt.compare(password, user.password) : false;

  if (!user || !passwordMatch) {
    if (user) {
      // Increment failed login attempts
      const updatedAttempts = user.failedLoginAttempts + 1;

      if (isNaN(updatedAttempts)) {
        console.error('Invalid failed login attempts value:', updatedAttempts);
        return; // or handle the error appropriately
      }

      // Lock account if max attempts reached
      if (updatedAttempts >= MAX_FAILED_ATTEMPTS) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: updatedAttempts,
            lockUntil: addMinutes(new Date(), LOCK_TIME_MINUTES),
          },
        });
        return {
          errors: {
            email: ["Account is locked due to too many failed login attempts."],
          },
        };
      } else {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: updatedAttempts,
          },
        });
      }
    }
    return {
      errors: {
        email: ["Invalid email or password"],
      },
    };
  }

  // Reset failed login attempts on successful login
  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: 0,
      lockUntil: null,
    },
  });

  // Ensure user has at least USER role
  if (!user.roleId) {
    const userRole = await prisma.role.findUnique({
      where: { name: 'USER' }
    });

    if (!userRole) {
      throw new Error('Default USER role not found');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { roleId: userRole.id }
    });
  }

  await createSession(user.id);

  await createAuditLog({
    action: 'LOGIN',
    userId: user.id,
    details: {
      email: user.email,
      success: true
    }
  });

  const canManageUserData = await hasPermission(user.id, Permission.CREATE_USER && Permission.DELETE_USER);
  
  // Redirect based on permissions
  redirect(canManageUserData ? "/dashboard" : "/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}