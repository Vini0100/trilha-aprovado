import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!name || !email || !phone || !password) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 });
    }

    // Verifica se já existe usuário
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'E-mail já cadastrado' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { name, email, phone, password: hashedPassword },
    });

    return NextResponse.json({ message: 'Usuário cadastrado com sucesso' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao cadastrar usuário' }, { status: 500 });
  }
}
