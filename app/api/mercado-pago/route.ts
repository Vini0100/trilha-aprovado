import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { findUserById } from '@/db/user';
import { findOrCreateAppointment } from '@/db/appointment';
import { findOrCreatePayment, updatePaymentProviderId } from '@/db/payment';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS || '',
  options: { timeout: 5000 },
});

export async function POST(request: NextRequest) {
  try {
  const { studentId, mentorId, subjectId, scheduleId, contactMethod, contactValue } = await request.json();

    const user = await findUserById(studentId);

    // 1. Verificar ou criar appointment
    const appointment = await findOrCreateAppointment({
      studentId,
      mentorId,
      subjectId,
      scheduleId,
      contactMethod,
      contactValue,
    });

    // 2. Criar pagamento pendente no banco
    const payment = await findOrCreatePayment({
      appointmentId: appointment.id,
      amount: 0.01,
    });

    // 3. Criar pagamento PIX no Mercado Pago
    const mpPayment = new Payment(client);
    const body = {
      transaction_amount: payment.amount,
      description: `Mentoria com ID ${mentorId}`,
      payment_method_id: 'pix',
      payer: { email: user?.email },
      metadata: { appointmentId: appointment.id },
    };

    const requestOptions = {
      idempotencyKey: `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
    };

    const response = await mpPayment.create({ body, requestOptions });

    // 4. Atualizar o providerId real no banco
    await updatePaymentProviderId({
      paymentId: payment.id,
      providerId: String(response.id),
    });

    // 5. Retornar QR Code PIX para o cliente
    const qrCode = response?.point_of_interaction?.transaction_data?.qr_code_base64;
    const ticketUrl = response?.point_of_interaction?.transaction_data?.ticket_url;

    return NextResponse.json({
      appointmentId: appointment.id,
      qrCode,
      ticketUrl,
      amount: payment.amount,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erro ao criar pagamento PIX' }, { status: 400 });
  }
}
