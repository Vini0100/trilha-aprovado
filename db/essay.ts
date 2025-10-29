import { prisma } from '@/lib/prisma';

export async function createEssay({
  studentId,
  mentorId,
  title,
  text,
}: {
  studentId: number;
  mentorId: number;
  title?: string | null;
  text: string;
}) {
  return prisma.essay.create({
    data: {
      studentId,
      mentorId,
      title: title ?? null,
      text,
      status: 'pending_payment',
    },
  });
}

export async function updateEssayStatus(essayId: number, status: string) {
  return prisma.essay.update({
    where: { id: essayId },
    data: { status, submittedAt: status === 'aguardando_revisao' ? new Date() : undefined },
  });
}

export async function finalizeEssayCorrection(
  essayId: number,
  { grade, feedback }: { grade: number; feedback: string },
) {
  return prisma.essay.update({
    where: { id: essayId },
    data: {
      grade,
      feedback,
      status: 'finalizada',
      correctedAt: new Date(),
    },
  });
}

export async function listStudentEssays(studentId: number) {
  return prisma.essay.findMany({
    where: { studentId },
    include: { mentor: { include: { user: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function listMentorEssays(mentorId: number) {
  return prisma.essay.findMany({
    where: { mentorId },
    include: { student: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getEssayById(essayId: number) {
  return prisma.essay.findUnique({
    where: { id: essayId },
    include: { mentor: { include: { user: true } }, student: true, payment: true },
  });
}

export async function findEssayByProviderId(providerId: string) {
  return prisma.essay.findFirst({ where: { payment: { providerId } } });
}
