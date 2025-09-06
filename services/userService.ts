export async function createUserService(data: {
  name: string;
  email: string;
  password: string;
  phone: string;
}) {
  const res = await fetch('/api/register/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Erro ao cadastrar usuário');
  }

  return res.json();
}
