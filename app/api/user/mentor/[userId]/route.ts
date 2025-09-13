import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { updateMentorProfile, getMentorProfile } from '@/db/mentor';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: NextRequest, context: { params: Promise<{ userId: string }> }) {
  const { userId } = await context.params; // 👈 precisa dar await

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'mentor' || session.user.id !== userId) {
    return NextResponse.redirect('/');
  }

  const profile = await getMentorProfile(Number(userId));
  return NextResponse.json(profile);
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ userId: string }> }) {
  const { userId } = await context.params; // 👈 precisa dar await

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'mentor' || session.user.id !== userId) {
    return NextResponse.redirect('/');
  }

  const body = await req.json();
  const updated = await updateMentorProfile(Number(userId), body);
  return NextResponse.json(updated);
}
