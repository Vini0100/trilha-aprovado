'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EssayEditor } from '@/components/EssayEditor';
import { useEssaySubmission } from '@/hooks/useEssay';
import { useSession } from 'next-auth/react';

export default function EnviarRedacaoPage() {
  const params = useParams();
  const mentorId = Number(params?.mentorId);
  const { data: session } = useSession();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const router = useRouter();

  const { submit, isSubmitting, qrCode, paymentAmount, showSuccess, reset } = useEssaySubmission();

  const onSubmit = () => {
    if (!title.trim() || !text.trim()) return;
    submit({ studentId: Number(session?.user.id), mentorId, title, text });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2 text-center">Escrever Redação</h1>
      <p className="text-center text-gray-600 mb-8">
        Desenvolva seu texto utilizando até 30 linhas
      </p>

      <div className="mb-4 max-w-4xl mx-auto">
        <Input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Título da redação"
        />
      </div>

      <div className="mb-8">
        <EssayEditor
          value={text}
          onChange={setText}
          placeholder="Comece a escrever sua redação aqui..."
        />
      </div>

      <div className="flex justify-center">
        <Button
          onClick={onSubmit}
          disabled={isSubmitting || !title.trim() || !text.trim()}
          size="lg"
          className="min-w-[200px]"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Redação'}
        </Button>
      </div>

      {qrCode && !showSuccess && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg flex flex-col items-center gap-2">
          <p className="text-sm">Escaneie o QR Code para pagar via PIX:</p>
          <img
            src={`data:image/png;base64,${qrCode.replace(/^data:image\/png;base64,/, '')}`}
            alt="QR Code Pix"
            className="w-48 h-48 border rounded-lg"
          />
          <p className="text-sm">
            Valor: {paymentAmount ? `R$ ${paymentAmount.toFixed(2).replace('.', ',')}` : 'R$ 0,00'}
          </p>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center gap-4">
            <h2 className="text-xl font-bold text-green-700">Redação enviada com sucesso!</h2>
            <Button
              onClick={() => {
                reset();
                router.push('/minhas-redacoes');
              }}
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
