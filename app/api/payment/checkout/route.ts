import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(req: Request) {
  const { appointmentId } = await req.json();

  try {
    const preference = await new Preference(client).create({
      body: {
        items: [
          {
            id: 'mentoria-mock',
            title: 'Mentoria - Mock',
            quantity: 1,
            unit_price: 100.0,
            currency_id: 'BRL',
          },
        ],
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/failure`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/pending`,
        },
        auto_return: 'approved',
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/webhook?secret=${process.env.MERCADO_PAGO_WEBHOOK_SECRET}`,
        metadata: {
          appointmentId,
        },
      },
    });
    return NextResponse.json({ preference });
  } catch (err: unknown) {
    let message = 'Unknown error';
    if (err instanceof Error) {
      message = err.message;
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
