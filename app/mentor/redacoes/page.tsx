'use client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useMentorProfile } from '@/hooks/useMentor';
import { useMentorEssays } from '@/hooks/useEssay';
import { formatEssayStatus } from '@/lib/utils';

export default function RedacoesParaCorrigirPage() {
  const { data: session } = useSession();
  const userId = Number(session?.user.id);
  const { data: mentorProfile } = useMentorProfile(userId || null);
  const mentorId = mentorProfile?.id as number | undefined;
  const { data: essays, isLoading } = useMentorEssays(mentorId);

  // Status format centralizado em lib/utils

  if (!mentorId) return <p>Carregando perfil...</p>;
  if (isLoading) return <p>Carregando redações...</p>;
  if (!essays || essays.length === 0) return <p>Nenhuma redação para corrigir.</p>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Redações para Corrigir</h1>
      <ul className="space-y-2">
        {essays.map((e: any) => (
          <li key={e.id} className="border rounded p-3 flex justify-between items-center">
            <div>
              {e.title && <div className="font-semibold text-gray-800">{e.title}</div>}
              <div className="text-sm text-muted-foreground">
                Enviado em: {new Date(e.submittedAt).toLocaleString('pt-BR')}
              </div>
              <div>Aluno: {e.studentName}</div>
              <div>Status: {formatEssayStatus(e.status)}</div>
            </div>
            {e.status === 'aguardando_revisao' ? (
              <Link className="text-blue-600 hover:underline" href={`/mentor/redacoes/${e.id}`}>
                Corrigir
              </Link>
            ) : (
              <span
                className="text-gray-400 select-none"
                title="Disponível após aprovação do pagamento"
              >
                Corrigir
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
