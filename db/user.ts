import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: string;
}) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      role: data.role || 'student',
    },
  });

  return user;
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findUserById(id: number) {
  return prisma.user.findUnique({ where: { id } });
}
