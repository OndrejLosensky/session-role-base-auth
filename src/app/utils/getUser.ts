import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/sessions"
import { redirect } from 'next/navigation'

export async function getUser() {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      role: {
        select: {
          id: true,
          name: true,
          description: true,
          permissions: {
            select: {
              name: true
            }
          },
          createdAt: true,
          updatedAt: true
        }
      },
      name: true,
      profilePicture: true,
      profileColor: true,
      password: true,
      createdAt: true,
      updatedAt: true,
    }
  })

  if (!user) {
    redirect('/login')
  }

  return user
}