import { prisma } from "@/lib/prisma";

export async function getAllUsers(limit?: number) {
  const users = await prisma.user.findMany({
    take: limit,
    select: {
      id: true,
      email: true,
      name: true,
      role: {
        select: {
          id: true,
          name: true,
          description: true,
          permissions: {
            select: {
              name: true,
            },
          },
        },
      },
      profilePicture: true,
      profileColor: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users.map((user) => ({
    ...user,
    role: {
      ...user.role,
      description: user.role.description || undefined,
    },
  }));
}

export async function getAllRoles(limit?: number) {
  return prisma.role.findMany({
    take: limit,
    include: {
      permissions: true,
    },
  });
}

export async function getAllPermissions(limit?: number) {
  return prisma.permission.findMany({
    take: limit,
    select: {
      id: true,
      name: true,
      description: true,
      roles: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}