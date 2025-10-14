import { Schedule, User } from '@/lib/generated/prisma';

export type MentorWithRelations = User & {
  schedules: Schedule[];
  subjects?: { id: number; name: string }[];
};

export async function createMentorService(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  bio: string;
  subjectsIds: number[];
}) {
  const res = await fetch('/api/register/mentor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Erro ao cadastrar mentor');
  }

  return res.json();
}

export async function getMentorProfileService(userId: number) {
  const res = await fetch(`/api/user/mentor/${userId}`);
  if (!res.ok) throw new Error('Erro ao buscar perfil do mentor');
  return res.json();
}

export async function updateMentorProfileService(
  userId: number,
  data: { name?: string; phone?: string; bio?: string },
) {
  const res = await fetch(`/api/user/mentor/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.message || 'Erro ao atualizar perfil do mentor');
  }

  return res.json();
}

export async function getMentorsService(): Promise<MentorWithRelations[]> {
  const res = await fetch('/api/user/mentor');
  if (!res.ok) throw new Error('Erro ao buscar mentores');
  return res.json();
}
