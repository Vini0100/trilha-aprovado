import { prisma } from '@/lib/prisma';

export async function createMentor(userId: number, bio: string, subjectsIds: number[]) {
  return prisma.mentor.create({
    data: {
      userId,
      bio,
      subjects: {
        connect: subjectsIds.map(id => ({ id })),
      },
    },
  });
}

export async function updateMentorProfile(
  userId: number,
  data: { name?: string; phone?: string; bio?: string },
) {
  // Atualiza dados do usuário (name, phone)
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      phone: data.phone,
    },
  });

  // Atualiza dados do mentor (bio)
  const mentor = await prisma.mentor.update({
    where: { userId },
    data: {
      bio: data.bio,
    },
  });

  return { user: updatedUser, mentor };
}

export async function getMentorProfile(userId: number) {
  return prisma.mentor.findUnique({
    where: { userId },
    include: {
      user: true,
      subjects: true,
    },
  });
}
