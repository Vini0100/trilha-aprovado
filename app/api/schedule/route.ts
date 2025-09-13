import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { changeScheduleStatus, createMentorSchedules, getMentorSchedules } from '@/db/schedule';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const mentorId = Number(req.nextUrl.searchParams.get('mentorId'));
  if (!mentorId) return NextResponse.json({ error: 'mentorId is required' }, { status: 400 });

  const schedules = await getMentorSchedules(mentorId);
  return NextResponse.json(schedules);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { mentorId, schedules } = await req.json();
  if (!mentorId || !schedules) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

  const created = await createMentorSchedules(mentorId, schedules);
  return NextResponse.json(created);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { scheduleId, status } = await req.json();
  if (!scheduleId || !status) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

  const updated = await changeScheduleStatus(scheduleId, status);
  return NextResponse.json(updated);
}
