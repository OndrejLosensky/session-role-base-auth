"use server";

import { z } from "zod";
import { createSession, deleteSession } from "@/lib/sessions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createAuditLog } from "@/lib/audit-logger";

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

  // Check if user exists and password matches
  const passwordMatch = user ? await bcrypt.compare(password, user.password) : false;

  if (!user || !passwordMatch) {
    return {
      errors: {
        email: ["Invalid email or password"],
      },
    };
  }

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

  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}