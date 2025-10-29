'use client';
import { useMentors } from '@/hooks/useMentor';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RedacaoHome() {
  const { data: mentors, isLoading } = useMentors();
  const accepts = (mentors || []).filter(m => m.acceptsEssays);

  if (isLoading) return <p>Carregando mentores...</p>;
  if (!accepts.length) return <p>Nenhum mentor disponível para correção de redações.</p>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Escolha um mentor para corrigir sua redação</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {accepts.map(m => (
          <Card key={m.id}>
            <CardHeader>
              <CardTitle>{m.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{m.bio}</p>
              </div>
              <Link className="text-blue-600 hover:underline" href={`/redacao/enviar/${m.id}`}>
                Enviar redação
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
