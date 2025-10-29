import { prisma } from '@/lib/prisma';

export async function createMentor(
  userId: number,
  bio: string,
  subjectsIds: number[],
  acceptsEssays: boolean = false,
) {
  return prisma.mentor.create({
    data: {
      userId,
      bio,
      acceptsEssays,
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

export async function findAllMentors() {
  try {
    const mentors = await prisma.mentor.findMany({
      select: {
        id: true,
        bio: true,
        acceptsEssays: true,
        user: {
          select: { name: true, phone: true },
        },
        subjects: {
          select: {
            id: true,
            name: true,
          },
        },
        schedules: {
          select: {
            id: true,
            day: true, // formato: "YYYY-MM-DD" ou "Monday"
            startTime: true, // "08:00"
            endTime: true, // "09:00"
            status: true, // "available" | "blocked" | "removed"
          },
        },
      },
    });

    return mentors.map(m => ({
      id: m.id,
      name: m.user.name,
      phone: m.user.phone,
      bio: m.bio,
      acceptsEssays: m.acceptsEssays,
      schedules: m.schedules,
      subjects: m.subjects,
    }));
  } catch (err) {
    // Fallback for environments where the DB hasn't been migrated yet
    // and the column `acceptsEssays` is missing. We omit the field and default to false.
    const mentors = await prisma.mentor.findMany({
      select: {
        id: true,
        bio: true,
        user: { select: { name: true, phone: true } },
        subjects: { select: { id: true, name: true } },
        schedules: {
          select: { id: true, day: true, startTime: true, endTime: true, status: true },
        },
      },
    });

    return mentors.map(m => ({
      id: m.id,
      name: m.user.name,
      phone: m.user.phone,
      bio: m.bio,
      acceptsEssays: false,
      schedules: m.schedules,
      subjects: m.subjects,
    }));
  }
}
