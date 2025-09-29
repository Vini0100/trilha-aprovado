import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const appointmentId = Number(req.nextUrl.searchParams.get('appointmentId'));
  if (!appointmentId) {
    return NextResponse.json({ error: 'appointmentId is required' }, { status: 400 });
  }

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
  });
}
