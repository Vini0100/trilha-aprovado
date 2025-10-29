import { NextRequest, NextResponse } from 'next/server';
import { finalizeEssayCorrection, getEssayById } from '@/db/essay';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const essay = await getEssayById(id);
  if (!essay) return NextResponse.json({ error: 'Redação não encontrada' }, { status: 404 });
  return NextResponse.json(essay);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const { grade, feedback } = await request.json();
  if (typeof grade !== 'number' || !feedback) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }
  const updated = await finalizeEssayCorrection(id, { grade, feedback });
  return NextResponse.json(updated);
}
