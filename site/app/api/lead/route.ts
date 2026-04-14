import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const GHL_API = 'https://services.leadconnectorhq.com';

export async function POST(req: Request) {
  try {
    const { name, email, phone, plan, pillar } = (await req.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      plan?: string;
      pillar?: 'trade' | 'credit';
    };

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email required' }, { status: 400 });
    }

    const GHL_TOKEN = process.env.GHL_PIT || '';
    const GHL_LOCATION = process.env.GHL_LOCATION || '';

    if (!GHL_TOKEN || !GHL_LOCATION) {
      return NextResponse.json({ ok: true, ghl: 'skipped — env not set' });
    }

    const [firstName, ...rest] = name.trim().split(' ');
    const lastName = rest.join(' ') || '';

    const res = await fetch(`${GHL_API}/contacts/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GHL_TOKEN}`,
        'Content-Type': 'application/json',
        Version: '2021-07-28',
      },
      body: JSON.stringify({
        locationId: GHL_LOCATION,
        firstName,
        lastName,
        email,
        phone: phone || '',
        tags: [
          pillar === 'credit' ? 'credit-lead' : 'pmf-lead',
          `plan-${plan || 'unknown'}`,
          'source-checkout',
        ],
        source: pillar === 'credit' ? 'PHIMINDFLOW Credit' : 'PHIMINDFLOW Checkout',
      }),
    });

    const data = await res.json();
    console.log('[GHL Lead]', res.status, JSON.stringify(data));
    return NextResponse.json({ ok: true, contactId: data?.contact?.id });
  } catch (err) {
    console.error('[GHL Lead Error]', err);
    return NextResponse.json({ ok: true, ghl: 'error — non-blocking' });
  }
}
