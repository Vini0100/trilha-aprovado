'use client';
import { useParams } from 'next/navigation';
import { useEssayDetails } from '@/hooks/useEssay';
import { EssayEditor } from '@/components/EssayEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { badgeVariantForEssayStatus, formatEssayStatus } from '@/lib/utils';

const statusLabels: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  pending_payment: { label: 'Pagamento Pendente', variant: 'outline' },
  aguardando_revisao: { label: 'Aguardando Revisão', variant: 'secondary' },
  finalizada: { label: 'Finalizada', variant: 'default' },
};

export default function MinhaRedacaoDetalhe() {
  const params = useParams();
  const id = Number(params?.id);
  const { data: essay, isLoading } = useEssayDetails(id);

  if (isLoading) return <p className="container mx-auto py-8">Carregando...</p>;
  if (!essay) return <p className="container mx-auto py-8">Redação não encontrada.</p>;

  const statusInfo = {
    label: formatEssayStatus(essay.status),
    variant: badgeVariantForEssayStatus(essay.status),
  } as const;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold">Detalhes da Redação</h1>
        <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
      </div>

      {essay.title && <h2 className="text-xl font-semibold text-gray-800 mb-4">{essay.title}</h2>}

      <div className="mb-2 text-gray-600">
        <p>
          <strong>Mentor:</strong> {essay.mentor.user.name}
        </p>
        <p>
          <strong>Enviada em:</strong> {new Date(essay.createdAt).toLocaleDateString('pt-BR')}
        </p>
      </div>

      {/* Redação em formato de papel */}
      <div className="my-8">
        <h2 className="text-xl font-semibold mb-4 text-center">Sua Redação</h2>
        <EssayEditor value={essay.text} readonly />
      </div>

      {/* Correção */}
      {essay.status === 'finalizada' && essay.grade !== null && (
        <Card className="mt-8 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Correção</span>
              <Badge variant="default" className="text-lg">
                Nota: {essay.grade.toFixed(1)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-2">
              Corrigida em:{' '}
              {essay.correctedAt ? new Date(essay.correctedAt).toLocaleDateString('pt-BR') : '—'}
            </p>
            <div className="mt-4 whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded border">
              {essay.feedback || 'Sem observações.'}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
