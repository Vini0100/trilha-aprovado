import { prisma } from '@/lib/prisma';

export async function GET() {
  const materias = await prisma.subject.findMany();
  return new Response(JSON.stringify(materias));
}
