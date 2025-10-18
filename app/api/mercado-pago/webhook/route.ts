// pages/api/mercado-pago/webhook.ts
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import {
  updatePaymentStatusByProviderId,
  findAppointmentByProviderId,
  updateAppointmentStatus,
  updateScheduleStatus,
} from '@/db/payment';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 1️⃣ Ler corpo cru como Buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of req) chunks.push(chunk);
    const rawBody = Buffer.concat(chunks).toString('utf-8');

    const payload = JSON.parse(rawBody);

    const signatureHeader = req.headers['x-signature'] as string | undefined;
    const topic = (req.headers['x-topic'] as string | undefined) || payload.type;
    const id = (req.headers['x-id'] as string | undefined) || payload.data?.id;
    const ts = signatureHeader?.split(',')[0]?.split('=')[1] ?? '';

    if (!signatureHeader || !process.env.MP_WEBHOOK_KEY) {
      console.log('Webhook sem assinatura ou sem chave configurada');
      return res.status(401).json({ error: 'Missing signature' });
    }

    const data = `${id}${topic}${ts}${rawBody}`;
    const hash = crypto
      .createHmac('sha256', process.env.MP_WEBHOOK_KEY!)
      .update(data)
      .digest('hex');
    const expectedSignature = `ts=${ts},v1=${hash}`;

    if (signatureHeader !== expectedSignature) {
      console.log('Assinatura inválida no webhook', { signatureHeader, expectedSignature });
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Processa pagamento normalmente
    if (payload.type === 'payment') {
      const providerId = String(payload.data.id);
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
        console.error('Erro ao buscar status do pagamento:', e);
        return res.status(500).json({ error: 'Erro ao buscar status do pagamento' });
      }

      if (!status) return res.status(400).json({ error: 'Status não encontrado' });

      await updatePaymentStatusByProviderId(providerId, status);

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
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Erro no webhook Mercado Pago:', err);
    return res.status(500).json({ error: 'Erro interno' });
  }
}
