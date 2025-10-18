import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  updatePaymentStatusByProviderId,
  findAppointmentByProviderId,
  updateAppointmentStatus,
  updateScheduleStatus,
} from '@/db/payment';
import { MercadoPagoConfig, Payment } from 'mercadopago';

const MP_WEBHOOK_KEY = process.env.MP_WEBHOOK_KEY || '';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Ler corpo cru usando TextDecoder do ReadableStream
    const rawBody = await (async () => {
      const reader = req.body?.getReader();
      if (!reader) return '';
      const chunks: Uint8Array[] = [];
      let done = false;
      while (!done) {
        const result = await reader.read();
        done = result.done ?? true;
        if (result.value) chunks.push(result.value);
      }
      return new TextDecoder().decode(Buffer.concat(chunks));
    })();

    const payload = JSON.parse(rawBody || '{}');

    // 2️⃣ Pega os headers
    const signatureHeader = req.headers.get('x-signature') ?? '';
    const topic = req.headers.get('x-topic') ?? payload.type ?? '';
    const id = req.headers.get('x-id') ?? payload.data?.id ?? '';
    const ts = signatureHeader.split(',')[0]?.split('=')[1] ?? '';

    if (!signatureHeader || !MP_WEBHOOK_KEY) {
      console.log('Webhook sem assinatura ou sem chave configurada');
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    // 3️⃣ String para assinar
    const data = `${id}${topic}${ts}${rawBody}`;

    const hash = crypto.createHmac('sha256', MP_WEBHOOK_KEY).update(data).digest('hex');
    const expectedSignature = `ts=${ts},v1=${hash}`;

    if (signatureHeader !== expectedSignature) {
      console.log(
        'Assinatura inválida no webhook',
        JSON.stringify(
          {
            id,
            topic,
            ts,
            signatureHeader,
            expectedSignature,
            hash,
            keyPreview: MP_WEBHOOK_KEY.slice(0, 4) + '...' + MP_WEBHOOK_KEY.slice(-4),
            bodyLength: rawBody?.length,
            bodyStart: rawBody?.slice(0, 100),
            bodyEnd: rawBody?.slice(-100),
            dataUsedToSignPreview: data.slice(0, 100),
            dataUsedToSignEnd: data.slice(-100),
          },
          null,
          2,
        ),
      );

      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // 4️⃣ Tratar pagamentos PIX
    if (payload.type === 'payment') {
      const paymentData = payload.data;
      const providerId = String(paymentData.id);

      const mpClient = new MercadoPagoConfig({
        accessToken: process.env.MERCADO_PAGO_ACCESS ?? process.env.MERCADO_PAGO_ACCESS_TOKEN ?? '',
        options: { timeout: 5000 },
      });
      const mpPayment = new Payment(mpClient);

      let status: string | null = null;
      try {
        const paymentInfo = await mpPayment.get({ id: providerId });
        status = paymentInfo.status ?? null;
      } catch (e) {
        console.error('Erro ao buscar status do pagamento na API Mercado Pago:', e);
        return NextResponse.json({ error: 'Erro ao buscar status do pagamento' }, { status: 500 });
      }

      if (!status) {
        console.log('Status do pagamento não encontrado na API Mercado Pago');
        return NextResponse.json({ error: 'Status do pagamento não encontrado' }, { status: 400 });
      }

      await updatePaymentStatusByProviderId(providerId, status);
      console.log(`Pagamento atualizado: ${providerId}, status: ${status}`);

      const appointment = await findAppointmentByProviderId(providerId);
      if (appointment) {
        await updateAppointmentStatus(
          appointment.id,
          status === 'approved' ? 'confirmed' : 'pending',
        );
        await updateScheduleStatus(
          appointment.scheduleId,
          status === 'approved' ? 'booked' : 'available',
        );
        console.log(
          `Appointment ${appointment.id} e Schedule ${appointment.scheduleId} atualizados`,
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Erro no webhook Mercado Pago:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
