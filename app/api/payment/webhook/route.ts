import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN! });
const payment = new Payment(client);

export async function POST(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get('secret');

  if (secret !== process.env.MERCADO_PAGO_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  if (body.type === 'payment') {
    const paymentId = body.data.id;

    const paymentResult = await payment.get({ id: paymentId });

    if (paymentResult.status === 'approved') {
      const appointmentId = paymentResult.metadata?.appointmentId;

      if (appointmentId) {
        await prisma.appointment.update({
          where: { id: Number(appointmentId) },
          data: { status: 'confirmed' },
        });

        await prisma.payment.create({
          data: {
            appointmentId: Number(appointmentId),
            providerId: String(paymentId),
            amount: paymentResult.transaction_amount ?? 0,
            status: 'approved',
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  }
}
