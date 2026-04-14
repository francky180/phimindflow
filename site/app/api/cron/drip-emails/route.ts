import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const SITE_URL = 'https://phimindflow.com';
const TELEGRAM_LINK = 'https://t.me/+pxyoRYABMO9kYmFh';
const GHL_API = 'https://services.leadconnectorhq.com';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY!);
}

// ─── Drip email templates ───────────────────────────────────────────

function wrapEmail(content: string) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:40px 24px;">
${content}
<div style="text-align:center;margin-top:32px;">
  <div style="font-size:11px;color:#7a7a86;letter-spacing:0.1em;">φ PHIMINDFLOW</div>
  <div style="font-size:11px;color:#4a4a56;margin-top:8px;">Structured wealth. Zero guesswork.</div>
</div>
</div></body></html>`;
}

function goldButton(href: string, text: string) {
  return `<div style="text-align:center;margin-top:32px;">
<a href="${href}" style="display:inline-block;background:#C9A84E;color:white;padding:14px 40px;border-radius:12px;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:0.1em;text-transform:uppercase;">${text} →</a>
</div>`;
}

const dripEmails = [
  {
    // Day 3 — Course buyers: first value + engagement
    day: 3,
    tag: 'drip-day-3',
    forProduct: 'course',
    subject: 'The #1 mistake new traders make (and how Fibonacci fixes it)',
    html: (name: string) => wrapEmail(`
      <div style="background:#121218;border:1px solid rgba(228,182,76,0.2);border-radius:20px;padding:40px 32px;">
        <h1 style="margin:0 0 16px;font-size:24px;font-weight:800;color:#f5f5f7;">Hey${name ? ` ${name}` : ''},</h1>
        <p style="font-size:15px;color:#c0c0c8;line-height:1.7;">Most traders lose because they enter based on <em>feelings</em>. A candle looks good. A signal fires. They jump in.</p>
        <p style="font-size:15px;color:#c0c0c8;line-height:1.7;">The Fibonacci framework eliminates this. Every entry has a <strong style="color:#e4b64c;">mathematical reason</strong>. Every exit is pre-defined. The system doesn't care about your mood — it cares about levels.</p>
        <p style="font-size:15px;color:#c0c0c8;line-height:1.7;">If you haven't started Module 1 yet, now is the time. The first framework takes 30 minutes to learn and will change how you see every chart.</p>
        ${goldButton(TELEGRAM_LINK, 'Open the Course')}
        <p style="font-size:13px;color:#7a7a86;margin-top:24px;text-align:center;">Reply to this email if you have questions. I read everything.</p>
      </div>`),
  },
  {
    // Day 7 — Course buyers: social proof + upsell hint
    day: 7,
    tag: 'drip-day-7',
    forProduct: 'course',
    subject: 'What 34.8% monthly growth actually looks like',
    html: (name: string) => wrapEmail(`
      <div style="background:#121218;border:1px solid rgba(228,182,76,0.2);border-radius:20px;padding:40px 32px;">
        <h1 style="margin:0 0 16px;font-size:24px;font-weight:800;color:#f5f5f7;">One week in${name ? `, ${name}` : ''}.</h1>
        <p style="font-size:15px;color:#c0c0c8;line-height:1.7;">By now you've seen the retracement levels, the risk framework, and the entry logic. Here's what those numbers look like in practice:</p>
        <div style="background:#0a0a0e;border:1px solid rgba(228,182,76,0.15);border-radius:14px;padding:20px 24px;margin:20px 0;">
          <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
            <span style="font-size:13px;color:#7a7a86;">Avg Monthly Growth</span>
            <span style="font-size:15px;font-weight:700;color:#22C55E;">+34.8%</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
            <span style="font-size:13px;color:#7a7a86;">Trades Executed</span>
            <span style="font-size:15px;font-weight:700;color:#e4b64c;">847+</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span style="font-size:13px;color:#7a7a86;">Risk/Reward</span>
            <span style="font-size:15px;font-weight:700;color:#e4b64c;">1:2.4</span>
          </div>
        </div>
        <p style="font-size:15px;color:#c0c0c8;line-height:1.7;">These results come from the exact system you're learning. The difference between course members and premium management? We execute it <em>for</em> you.</p>
        <p style="font-size:15px;color:#c0c0c8;line-height:1.7;">If the system makes sense but you want someone to run it — <strong style="color:#e4b64c;">Premium Management</strong> handles everything for $1,500.</p>
        ${goldButton(SITE_URL + '/checkout?plan=management', 'Learn About Management')}
      </div>`),
  },
  {
    // Day 14 — Course buyers: hard upsell
    day: 14,
    tag: 'drip-day-14',
    forProduct: 'course',
    subject: 'Let us run the system for you',
    html: (name: string) => wrapEmail(`
      <div style="background:#121218;border:1px solid rgba(228,182,76,0.2);border-radius:20px;padding:40px 32px;">
        <h1 style="margin:0 0 16px;font-size:24px;font-weight:800;color:#f5f5f7;">Two weeks${name ? `, ${name}` : ''}.</h1>
        <p style="font-size:15px;color:#c0c0c8;line-height:1.7;">You understand the Fibonacci framework now. You know why the levels work. You've seen the math.</p>
        <p style="font-size:15px;color:#c0c0c8;line-height:1.7;">Some people love executing trades themselves. Others have a full-time job and want the returns without the screen time.</p>
        <p style="font-size:15px;color:#c0c0c8;line-height:1.7;">That's what <strong style="color:#e4b64c;">Premium Management</strong> is for:</p>
        <div style="background:#0a0a0e;border:1px solid rgba(228,182,76,0.15);border-radius:14px;padding:20px 24px;margin:20px 0;">
          <div style="font-size:14px;color:#c0c0c8;line-height:1.8;">
            ✓ We execute every trade using your funded account<br>
            ✓ Same Fibonacci framework you learned<br>
            ✓ Risk management built in — no guessing<br>
            ✓ Monthly performance reports<br>
            ✓ One-time $1,500 — no recurring fees
          </div>
        </div>
        <p style="font-size:15px;color:#c0c0c8;line-height:1.7;">You already invested $250 to learn the system. This is the next step — let us run it while you focus on your life.</p>
        ${goldButton(SITE_URL + '/checkout?plan=management', 'Upgrade to Management')}
        <p style="font-size:13px;color:#7a7a86;margin-top:24px;text-align:center;">Reply "interested" and I'll walk you through it personally.</p>
      </div>`),
  },
];

// ─── Cron handler — runs daily at 9am UTC ───────────────────────────

export async function GET(req: Request) {
  // Verify cron secret in production
  const authHeader = req.headers.get('authorization');
  if (process.env.VERCEL_ENV === 'production' && process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const GHL_TOKEN = process.env.GHL_PIT || '';
  const GHL_LOCATION = process.env.GHL_LOCATION || '';
  if (!GHL_TOKEN || !GHL_LOCATION) {
    return NextResponse.json({ error: 'Missing GHL credentials' }, { status: 500 });
  }

  const resend = getResend();
  const results: string[] = [];

  for (const drip of dripEmails) {
    try {
      // Find contacts who purchased X days ago and haven't received this drip
      // Search for contacts with purchase-confirmed + product-course but NOT drip-day-X
      const searchRes = await fetch(`${GHL_API}/contacts/search`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GHL_TOKEN}`,
          'Content-Type': 'application/json',
          Version: '2021-07-28',
        },
        body: JSON.stringify({
          locationId: GHL_LOCATION,
          query: '',
          filters: [
            { field: 'tags', operator: 'contains', value: 'purchase-confirmed' },
            { field: 'tags', operator: 'contains', value: `product-${drip.forProduct}` },
            { field: 'tags', operator: 'not_contains', value: drip.tag },
          ],
          pageLimit: 50,
        }),
      });
      const searchData = await searchRes.json();
      const contacts = searchData.contacts || [];

      for (const contact of contacts) {
        // Check if enough days have passed since purchase
        // Use contact's dateUpdated or dateAdded as proxy for purchase date
        const purchaseDate = new Date(contact.dateUpdated || contact.dateAdded || contact.createdAt);
        const daysSincePurchase = Math.floor((Date.now() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysSincePurchase >= drip.day) {
          const email = contact.email;
          const name = contact.firstName || '';

          if (!email) continue;

          // Send the drip email
          await resend.emails.send({
            from: 'PHIMINDFLOW <onboarding@phimindflow.com>',
            to: email,
            subject: drip.subject,
            html: drip.html(name),
          });

          // Tag contact so we don't send again
          await fetch(`${GHL_API}/contacts/${contact.id}`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${GHL_TOKEN}`,
              'Content-Type': 'application/json',
              Version: '2021-07-28',
            },
            body: JSON.stringify({
              tags: [...(contact.tags || []), drip.tag],
            }),
          });

          results.push(`Sent ${drip.tag} to ${email}`);
        }
      }
    } catch (err) {
      results.push(`Error on ${drip.tag}: ${err instanceof Error ? err.message : 'unknown'}`);
    }
  }

  return NextResponse.json({
    processed: results.length,
    results,
    timestamp: new Date().toISOString(),
  });
}
