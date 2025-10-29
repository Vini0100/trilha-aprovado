import { NextRequest, NextResponse } from 'next/server';
import { getEssayById } from '@/db/essay';

export async function GET(request: NextRequest) {
  const essayId = Number(request.nextUrl.searchParams.get('essayId'));
  if (!essayId) return NextResponse.json({ error: 'essayId is required' }, { status: 400 });
  const essay = await getEssayById(essayId);
  if (!essay) return NextResponse.json({ error: 'Redação não encontrada' }, { status: 404 });
  return NextResponse.json({
    status: essay.status,
    submittedAt: essay.submittedAt ?? essay.createdAt,
  });
}
