import { prisma } from '@/lib/prisma';

export async function getMentorSchedules(mentorId: number) {
  return prisma.schedule.findMany({
    where: { mentorId },
    orderBy: { day: 'asc' },
  });
}

export async function createMentorSchedules(
  mentorId: number,
  schedules: { day: string; startTime: string; endTime: string }[],
) {
  const created = await prisma.schedule.createMany({
    data: schedules.map(s => ({
      mentorId,
      day: s.day,
      startTime: s.startTime,
      endTime: s.endTime,
    })),
    skipDuplicates: true,
  });
  return created;
}

export async function changeScheduleStatus(
  scheduleId: number,
  status: 'available' | 'blocked' | 'removed',
) {
  return prisma.schedule.update({
    where: { id: scheduleId },
    data: { status },
  });
}
