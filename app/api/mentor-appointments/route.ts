import { NextRequest, NextResponse } from 'next/server';
import { getMentorAppointments } from '@/db/appointment';

export async function GET(req: NextRequest) {
  const mentorId = Number(req.nextUrl.searchParams.get('mentorId'));
  if (!mentorId) {
    return NextResponse.json({ error: 'mentorId is required' }, { status: 400 });
  }
  const appointments = await getMentorAppointments(mentorId);
  return NextResponse.json(
    appointments.map(a => ({
      id: a.id,
      date: a.schedule?.day,
      time: a.schedule?.startTime,
      studentName: a.student?.name,
      status: a.status,
    })),
  );
}
