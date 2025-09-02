import { PrismaClient } from '../lib/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  const mentorshipSubjects = [
    { name: 'OAB - Exame da Ordem' },
    { name: 'TCE - Tribunal de Contas' },
    { name: 'Magistratura' },
    { name: 'Ministério Público' },
    { name: 'Defensoria Pública' },
    { name: 'Delegacia de Polícia' },
  ];

  for (const subject of mentorshipSubjects) {
    await prisma.subject.upsert({
      where: { name: subject.name },
      update: {},
      create: subject,
    });
  }

  console.log('Matérias populadas com sucesso!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
