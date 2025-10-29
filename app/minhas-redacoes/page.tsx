'use client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useStudentEssays } from '@/hooks/useEssay';
import { formatEssayStatus } from '@/lib/utils';

export default function MinhasRedacoesPage() {
  const { data: session } = useSession();
  const { data: essays, isLoading } = useStudentEssays(Number(session?.user.id));

  // Status format centralized in lib/utils

  if (isLoading) return <p>Carregando...</p>;
  if (!essays || essays.length === 0) return <p>Nenhuma redação enviada.</p>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Minhas Redações</h1>
      <ul className="space-y-2">
        {essays.map((e: any) => (
          <li key={e.id} className="border rounded p-3 flex justify-between items-center">
            <div>
              {e.title && <div className="font-semibold text-gray-800">{e.title}</div>}
              <div className="text-sm text-muted-foreground">
                Enviado em: {new Date(e.submittedAt).toLocaleString('pt-BR')}
              </div>
              <div>Mentor: {e.mentorName}</div>
              <div>Status: {formatEssayStatus(e.status)}</div>
            </div>
            <Link className="text-blue-600 hover:underline" href={`/minhas-redacoes/${e.id}`}>
              Ver
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
