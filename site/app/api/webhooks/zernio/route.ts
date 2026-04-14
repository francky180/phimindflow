import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  let body: string;
  try {
    body = await request.text();
  } catch {
    return NextResponse.json({ received: true });
  }

  const signature = request.headers.get('x-zernio-signature');
  const secret = process.env.ZERNIO_WEBHOOK_SECRET;

  if (secret && signature) {
    const expected = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (signature !== expected) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }

  let event;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ received: true });
  }

  const type = event.type || event.event || 'unknown';
  console.log(`[Zernio] ${type}`, JSON.stringify(event, null, 2));

  return NextResponse.json({ received: true });
}

export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'zernio-webhook' });
}
