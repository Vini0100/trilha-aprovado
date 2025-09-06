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
