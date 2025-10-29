import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createEssay, getEssayById, listMentorEssays, listStudentEssays } from '@/db/essay';
import { findUserById } from '@/db/user';
import { findOrCreateEssayPayment, updatePaymentProviderId } from '@/db/payment';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS || process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
  options: { timeout: 5000 },
});

export async function GET(request: NextRequest) {
  const studentId = Number(request.nextUrl.searchParams.get('studentId'));
  const mentorId = Number(request.nextUrl.searchParams.get('mentorId'));
  if (studentId) {
    const essays = await listStudentEssays(studentId);
    return NextResponse.json(
      essays.map(e => ({
        id: e.id,
        title: (e as any)?.title,
        mentorName: e.mentor.user.name,
        status: e.status,
        submittedAt: e.submittedAt ?? e.createdAt,
      })),
    );
  }
  if (mentorId) {
    const essays = await listMentorEssays(mentorId);
    return NextResponse.json(
      essays.map(e => ({
        id: e.id,
        title: (e as any)?.title,
        studentName: e.student.name,
        status: e.status,
        submittedAt: e.submittedAt ?? e.createdAt,
      })),
    );
  }
  return NextResponse.json({ error: 'studentId or mentorId is required' }, { status: 400 });
}

export async function POST(request: NextRequest) {
  try {
    const { studentId, mentorId, title, text } = await request.json();
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Título é obrigatório' }, { status: 400 });
    }
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'Texto da redação é obrigatório' }, { status: 400 });
    }
    const user = await findUserById(studentId);
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

    // 1. Criar redação em status de pagamento pendente
    const essay = await createEssay({ studentId, mentorId, title: title.trim(), text });

    // 2. Criar/obter pagamento da redação
    const payment = await findOrCreateEssayPayment({ essayId: essay.id, amount: 0.01 });

    // 3. Criar pagamento PIX na API Mercado Pago
    const mpPayment = new Payment(client);
    const body = {
      transaction_amount: payment.amount,
      description: `Redação para correção${title ? `: ${title}` : ''} (mentor ${mentorId})`,
      payment_method_id: 'pix',
      payer: { email: user.email },
      metadata: { essayId: essay.id },
    };
    const requestOptions = {
      idempotencyKey: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    };
    const response = await mpPayment.create({ body, requestOptions });

    // 4. Salvar providerId
    await updatePaymentProviderId({ paymentId: payment.id, providerId: String(response.id) });

    const qrCode = response?.point_of_interaction?.transaction_data?.qr_code_base64;
    const ticketUrl = response?.point_of_interaction?.transaction_data?.ticket_url;

    return NextResponse.json({ essayId: essay.id, qrCode, ticketUrl, amount: payment.amount });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erro ao criar pagamento de redação' }, { status: 400 });
  }
}
