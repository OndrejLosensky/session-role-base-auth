import { prisma } from "@/lib/prisma";

export function getAllUsersNumber() {
  return prisma.user.count();
}

export function getAllRolesNumber() {
  return prisma.role.count();
}

export function getAllPermissionsNumber() {
  return prisma.permission.count();
}