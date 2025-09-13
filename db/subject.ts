import { prisma } from '@/lib/prisma';

export async function findManySubjects() {
  return prisma.subject.findMany(); // retorna só os dados
}
