import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  updatePaymentStatusByProviderId,
  findAppointmentByProviderId,
  updateAppointmentStatus,
  updateScheduleStatus,
} from '@/db/payment';
import { MercadoPagoConfig, Payment } from 'mercadopago';

// const MP_WEBHOOK_KEY = process.env.MP_WEBHOOK_KEY || ''; // sua assinatura secreta
// const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    const payload = JSON.parse(bodyText);

    // // 1️⃣ Validar assinatura só em produção
    // if (IS_PRODUCTION) {
    //   const signature = req.headers.get('x-mp-signature');
    //   const hash = crypto.createHmac('sha256', MP_WEBHOOK_KEY).update(bodyText).digest('hex');
    //   if (hash !== signature) {
    //     console.log('Assinatura inválida no webhook');
    //     return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    //   }
    // }

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
