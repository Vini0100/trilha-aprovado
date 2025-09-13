import { findManySubjects } from '@/db/subject';

export async function GET() {
  const subjects = await findManySubjects();
  return new Response(JSON.stringify(subjects));
}
