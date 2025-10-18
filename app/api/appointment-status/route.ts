import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const appointmentId = Number(req.nextUrl.searchParams.get('appointmentId'));
  const userId = Number(req.nextUrl.searchParams.get('userId'));

  if (appointmentId) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { schedule: true },
    });
    if (!appointment) {
      return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 });
    }
    return NextResponse.json({
      status: appointment.status,
      date: appointment.schedule?.day,
      time: appointment.schedule?.startTime,
      contactMethod: appointment.contactMethod,
      contactValue: appointment.contactValue,
    });
  }

  if (userId) {
    // Buscar todos os agendamentos aprovados do usuário
    const appointments = await prisma.appointment.findMany({
      where: {
        studentId: userId,
        status: {
          in: ['confirmed', 'approved'],
        },
      },
      include: {
        schedule: true,
        mentor: { include: { user: true } },
        subject: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(
      appointments.map(appt => {
        return {
          id: appt.id,
          date: appt.schedule?.day,
          time: appt.schedule?.startTime,
          mentorName: appt.mentor?.user?.name,
          subjectName: appt.subject?.name,
          status: appt.status,
          contactMethod: appt.contactMethod,
          contactValue: appt.contactValue,
        };
      }),
    );
  }

  return NextResponse.json({ error: 'appointmentId or userId is required' }, { status: 400 });
}
