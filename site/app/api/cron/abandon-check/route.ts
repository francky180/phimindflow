import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const GHL_API = 'https://services.leadconnectorhq.com';

export async function GET() {
  const GHL_TOKEN = process.env.GHL_PIT || '';
  const GHL_LOCATION = process.env.GHL_LOCATION || '';

  if (!GHL_TOKEN || !GHL_LOCATION) {
    return NextResponse.json({ ok: true, skipped: 'env not set' });
  }

  try {
    // Search for contacts tagged pmf-lead but NOT purchase-confirmed
    const res = await fetch(
      `${GHL_API}/contacts/?locationId=${GHL_LOCATION}&limit=100`,
      {
        headers: {
          Authorization: `Bearer ${GHL_TOKEN}`,
          Version: '2021-07-28',
        },
      }
    );

    const data = await res.json();
    const contacts = data?.contacts || [];

    // Filter: has pmf-lead tag, does NOT have purchase-confirmed, does NOT have abandonment-email-sent
    const abandoned = contacts.filter((c: { tags?: string[] }) => {
      const tags = c.tags || [];
      return (
        tags.includes('pmf-lead') &&
        !tags.includes('purchase-confirmed') &&
        !tags.includes('abandonment-email-sent')
      );
    });

    let tagged = 0;
    for (const contact of abandoned) {
      // Tag them so GHL workflow picks them up
      await fetch(`${GHL_API}/contacts/${contact.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${GHL_TOKEN}`,
          'Content-Type': 'application/json',
          Version: '2021-07-28',
        },
        body: JSON.stringify({
          tags: [...(contact.tags || []), 'abandonment-email-sent'],
        }),
      });
      tagged++;
    }

    return NextResponse.json({ ok: true, checked: contacts.length, abandoned: abandoned.length, tagged });
  } catch (err) {
    console.error('[Abandon Check Error]', err);
    return NextResponse.json({ ok: true, error: 'non-blocking' });
  }
}
