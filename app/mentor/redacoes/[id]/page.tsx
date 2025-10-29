'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEssayDetails, useFinalizeEssay } from '@/hooks/useEssay';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EssayEditor } from '@/components/EssayEditor';
import { toast } from 'sonner';

export default function CorrigirRedacaoPage() {
  const params = useParams();
  const id = Number(params?.id);
  const { data: essay, isLoading } = useEssayDetails(id);
  const [grade, setGrade] = useState<string>('');
  const [feedback, setFeedback] = useState('');
  const router = useRouter();
  const finalize = useFinalizeEssay();

  if (isLoading) return <p className="container mx-auto py-8">Carregando...</p>;
  if (!essay) return <p className="container mx-auto py-8">Redação não encontrada.</p>;

  const onFinalize = async () => {
    const gradeNum = Number(grade);
    if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 10) {
      toast.error('Digite uma nota válida entre 0 e 10');
      return;
    }
    try {
      await finalize.mutateAsync({ id, grade: gradeNum, feedback });
      toast.success('Correção finalizada!');
      router.push('/mentor/redacoes');
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao finalizar correção');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2 text-center">Corrigir Redação</h1>
      {essay.title && (
        <p className="text-center text-lg font-semibold text-gray-800 mb-2">{essay.title}</p>
      )}
      <p className="text-center text-gray-600 mb-2">
        Aluno: <strong>{essay.student.name}</strong>
      </p>
      <p className="text-center text-gray-500 text-sm mb-8">
        Enviada em: {new Date(essay.createdAt).toLocaleDateString('pt-BR')}
      </p>

      {/* Exibe a redação com o mesmo layout */}
      <div className="mb-8">
        <EssayEditor value={essay.text} readonly />
      </div>

      {/* Formulário de correção */}
      {essay.status === 'aguardando_revisao' ? (
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 border">
          <h2 className="text-xl font-bold mb-4">Avaliação</h2>
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium block mb-2">Nota (0 a 10)</label>
              <Input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={grade}
                onChange={e => setGrade(e.target.value)}
                placeholder="Ex: 9.5"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Observações e Feedback</label>
              <Textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder="Escreva suas observações sobre a redação..."
                className="min-h-[200px]"
              />
            </div>
            <Button
              className="mt-2"
              onClick={onFinalize}
              disabled={finalize.isPending || !grade || !feedback.trim()}
              size="lg"
            >
              {finalize.isPending ? 'Finalizando...' : 'Finalizar Correção'}
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">
          Correção disponível após aprovação do pagamento.
        </p>
      )}
    </div>
  );
}
