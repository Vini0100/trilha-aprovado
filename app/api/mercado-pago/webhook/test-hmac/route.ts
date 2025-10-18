import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const DEBUG_TOKEN = process.env.MP_WEBHOOK_VIEW_TOKEN || 'dev-token';
const MP_WEBHOOK_KEY = process.env.MP_WEBHOOK_KEY || '';
const MP_WEBHOOK_DEBUG = process.env.MP_WEBHOOK_DEBUG === 'true';

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');

  if (!MP_WEBHOOK_DEBUG && token !== DEBUG_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const bodyText = await req.text();
  try {
    const computed = crypto.createHmac('sha256', MP_WEBHOOK_KEY).update(bodyText).digest('hex');
    return NextResponse.json({
      computedHash: computed,
      keyLength: MP_WEBHOOK_KEY ? MP_WEBHOOK_KEY.length : 0,
      bodyPrefix: bodyText.slice(0, 2000),
    });
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to compute HMAC', details: String(e) },
      { status: 500 },
    );
  }
}
