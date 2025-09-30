import { prisma } from '@/lib/prisma';

export async function findOrCreateAppointment({
  studentId,
  mentorId,
  subjectId,
  scheduleId,
}: {
  studentId: number;
  mentorId: number;
  subjectId: number;
  scheduleId: number;
}) {
  // Verifica se já existe appointment para esse horário + aluno
  let appointment = await prisma.appointment.findUnique({
    where: {
      scheduleId_studentId: {
        scheduleId,
        studentId,
      },
    },
  });

  if (!appointment) {
    appointment = await prisma.appointment.create({
      data: {
        studentId,
        mentorId,
        subjectId,
        scheduleId,
        status: 'pending',
      },
    });
  }

  return appointment;
}

export async function getMentorAppointments(mentorId: number) {
  return prisma.appointment.findMany({
    where: {
      mentorId,
      status: {
        in: ['confirmed', 'approved'],
      },
    },
    include: {
      schedule: true,
      student: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}
