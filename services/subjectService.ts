import { Subject } from '@/lib/generated/prisma';

export async function getSubjectService(): Promise<Subject[]> {
  const res = await fetch('/api/subject', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch subjects');
  }

  return res.json();
}
