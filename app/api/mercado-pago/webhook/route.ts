import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  updatePaymentStatusByProviderId,
  findAppointmentByProviderId,
  updateAppointmentStatus,
  updateScheduleStatus,
} from '@/db/payment';
import { pushLog } from '@/lib/webhookDebug';
import { MercadoPagoConfig, Payment } from 'mercadopago';

const MP_WEBHOOK_KEY = process.env.MP_WEBHOOK_KEY || ''; // sua assinatura secreta
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const MP_WEBHOOK_DEBUG = process.env.MP_WEBHOOK_DEBUG === 'true';

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    const payload = JSON.parse(bodyText);

    // 1️⃣ Validar assinatura só em produção
    if (IS_PRODUCTION) {
      const signature = req.headers.get('x-mp-signature');
      const hash = crypto.createHmac('sha256', MP_WEBHOOK_KEY).update(bodyText).digest('hex');

      // Debug: controlled by MP_WEBHOOK_DEBUG env var
      if (MP_WEBHOOK_DEBUG) {
        const meta = {
          signature,
          computedHash: hash,
          keyLength: MP_WEBHOOK_KEY ? MP_WEBHOOK_KEY.length : 0,
        };
        pushLog({ level: 'debug', message: 'MP webhook debug: header vs computed', meta });
      }

      if (!signature) {
        console.error('MP webhook: missing x-mp-signature header');
        if (MP_WEBHOOK_DEBUG) {
          pushLog({
            level: 'error',
            message: 'MP webhook: missing x-mp-signature header',
            meta: { url: req.url },
          });
        }
        if (MP_WEBHOOK_DEBUG) {
          // Log headers and request meta for investigation (avoid logging secrets)
          try {
            const headersObj: Record<string, string | null> = {};
            for (const [k, v] of req.headers) headersObj[k] = v;
            pushLog({
              level: 'debug',
              message: 'MP webhook missing signature - headers',
              meta: {
                headers: headersObj,
                url: req.url,
                method: req.method,
                xff: req.headers.get('x-forwarded-for'),
                bodyPrefix: bodyText.slice(0, 2000),
              },
            });
          } catch (e) {
            pushLog({
              level: 'error',
              message: 'MP webhook debug: error while logging headers',
              meta: { error: String(e) },
            });
          }
        }
        return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
      }

      if (hash !== signature) {
        // Minimal production log to avoid leaking secret; if more details are needed, set MP_WEBHOOK_DEBUG=true
        console.error('Assinatura inválida no webhook (hash !== signature)');
        if (MP_WEBHOOK_DEBUG) {
          pushLog({
            level: 'error',
            message: 'Assinatura inválida no webhook (hash !== signature)',
            meta: { signature, computedHash: hash, bodyPrefix: bodyText.slice(0, 2000) },
          });
        }
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    // 2️⃣ Tratar pagamentos PIX
    if (payload.type === 'payment') {
      const paymentData = payload.data;
      const providerId = String(paymentData.id);

      // Buscar status real na API do Mercado Pago
      const mpClient = new MercadoPagoConfig({
        accessToken: process.env.MERCADO_PAGO_ACCESS || process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
        options: { timeout: 5000 },
      });
      const mpPayment = new Payment(mpClient);
      let status = null;
      try {
        const paymentInfo = await mpPayment.get({ id: providerId });
        status = paymentInfo.status;
      } catch (e) {
        console.error('Erro ao buscar status do pagamento na API Mercado Pago:', e);
        return NextResponse.json({ error: 'Erro ao buscar status do pagamento' }, { status: 500 });
      }
      if (!status) {
        console.log('Status do pagamento não encontrado na API Mercado Pago');
        return NextResponse.json({ error: 'Status do pagamento não encontrado' }, { status: 400 });
      }

      // 3️⃣ Atualizar Payment
      await updatePaymentStatusByProviderId(providerId, status);

      console.log(`Pagamento atualizado: ${providerId}, status: ${status}`);

      // 4️⃣ Atualizar Appointment e Schedule
      const appointment = await findAppointmentByProviderId(providerId);

      if (appointment) {
        // atualizar status da appointment
        await updateAppointmentStatus(
          appointment.id,
          status === 'approved' ? 'confirmed' : 'pending',
        );
        // atualizar status do schedule
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
