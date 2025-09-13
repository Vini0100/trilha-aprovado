import { NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '@/db/user';
import { createMentor } from '@/db/mentor';

export async function POST(req: Request) {
  try {
    const { name, email, password, phone, bio, subjectsIds } = await req.json();

    if (!name || !email || !password || !bio || !subjectsIds?.length) {
      return NextResponse.json({ error: 'Preencha todos os campos obrigatórios' }, { status: 400 });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'E-mail já cadastrado' }, { status: 400 });
    }

    // Reaproveita a função de criar usuário
    const user = await createUser({ name, email, password, phone, role: 'mentor' });

    const mentor = await createMentor(user.id, bio, subjectsIds);

    return NextResponse.json({ user, mentor }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao cadastrar mentor' }, { status: 500 });
  }
}
