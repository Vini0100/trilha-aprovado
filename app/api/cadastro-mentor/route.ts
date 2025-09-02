import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function cadastrarMentor(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  bio?: string;
  subjectsIds: number[];
}) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Cria o usuário com role mentor
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      role: 'mentor',
    },
  });

  // Cria o perfil de mentor
  const mentor = await prisma.mentor.create({
    data: {
      userId: user.id,
      bio: data.bio,
      subjects: {
        connect: data.subjectsIds.map(id => ({ id })),
      },
    },
  });

  return { user, mentor };
}
