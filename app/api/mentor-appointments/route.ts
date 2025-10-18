import { NextRequest, NextResponse } from 'next/server';
import { getMentorAppointments } from '@/db/appointment';

export async function GET(req: NextRequest) {
  const mentorId = Number(req.nextUrl.searchParams.get('mentorId'));
  if (!mentorId) {
    return NextResponse.json({ error: 'mentorId is required' }, { status: 400 });
  }
  const appointments = await getMentorAppointments(mentorId);
  return NextResponse.json(
    appointments.map(appt => {
      return {
        id: appt.id,
        date: appt.schedule?.day,
        time: appt.schedule?.startTime,
        studentName: appt.student?.name,
        status: appt.status,
        contactMethod: appt.contactMethod,
        contactValue: appt.contactValue,
      };
    }),
  );
}
