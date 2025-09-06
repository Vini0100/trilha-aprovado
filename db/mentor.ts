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
