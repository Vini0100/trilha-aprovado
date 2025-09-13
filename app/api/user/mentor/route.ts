import { NextResponse } from 'next/server';
import { findAllMentors } from '@/db/mentor';

export async function GET() {
  const mentors = await findAllMentors();
  return NextResponse.json(mentors);
}
