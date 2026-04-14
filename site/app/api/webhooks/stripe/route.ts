import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const GHL_API = 'https://services.leadconnectorhq.com';
const TELEGRAM_LINK = 'https://t.me/+pxyoRYABMO9kYmFh';
const SITE_URL = 'https://phimindflow.com';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-03-25.dahlia' });
}
function getResend() {
  return new Resend(process.env.RESEND_API_KEY!);
}

// ─── Welcome email HTML ─────────────────────────────────────────────
function buildWelcomeEmail(name: string, product: string) {
  const isCourse = product === 'course';
  const productLabel = isCourse ? 'Fibonacci Framework Course' : 'Managed Execution';
  const priceLabel = isCourse ? '$250' : '$1,500';

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-block;background:rgba(228,182,76,0.1);border:1px solid rgba(228,182,76,0.3);border-radius:999px;padding:8px 20px;font-size:11px;font-weight:700;letter-spacing:0.22em;color:#e4b64c;text-transform:uppercase;">
        ● Payment Confirmed
      </div>
    </div>

    <!-- Main card -->
    <div style="background:#121218;border:1px solid rgba(228,182,76,0.2);border-radius:20px;padding:40px 32px;">
      <h1 style="margin:0 0 8px;font-size:28px;font-weight:800;color:#f5f5f7;letter-spacing:-0.02em;">
        Welcome to <span style="color:#e4b64c;">PHIMINDFLOW.</span>
      </h1>
      <p style="margin:0 0 24px;font-size:15px;color:#c0c0c8;line-height:1.6;">
        ${name ? `Hey ${name},` : 'Hey,'} your <strong style="color:#e4b64c;">${productLabel}</strong> (${priceLabel}) is now active. Everything you need is below.
      </p>

      <!-- Telegram Access -->
      <a href="${TELEGRAM_LINK}" style="display:block;background:#0a0a0e;border:1px solid rgba(228,182,76,0.2);border-radius:14px;padding:20px 24px;margin-bottom:16px;text-decoration:none;">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.22em;color:#e4b64c;margin-bottom:4px;">YOUR COURSE ACCESS</div>
        <div style="font-size:15px;font-weight:600;color:#f5f5f7;">Join the Private Telegram Group</div>
        <div style="font-size:12px;color:#7a7a86;margin-top:4px;">Full Fibonacci framework, risk management, execution playbook</div>
      </a>

      <!-- Site link -->
      <a href="${SITE_URL}" style="display:block;background:#0a0a0e;border:1px solid rgba(228,182,76,0.2);border-radius:14px;padding:20px 24px;margin-bottom:24px;text-decoration:none;">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.22em;color:#e4b64c;margin-bottom:4px;">YOUR DASHBOARD</div>
        <div style="font-size:15px;font-weight:600;color:#f5f5f7;">phimindflow.com</div>
        <div style="font-size:12px;color:#7a7a86;margin-top:4px;">Process, course content, and management details</div>
      </a>

      <!-- Next Steps -->
      <div style="background:#0a0a0e;border:1px solid rgba(228,182,76,0.15);border-radius:14px;padding:20px 24px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.22em;color:#e4b64c;margin-bottom:12px;">NEXT STEPS</div>
        <div style="font-size:14px;color:#c0c0c8;line-height:1.7;">
          1. Click the Telegram link above and join the group.<br>
          2. Introduce yourself — we start immediately.<br>
          3. ${isCourse ? 'Begin with Module 1: Fibonacci Methodology.' : 'Your managed account setup begins within 24h.'}
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:32px;">
      <div style="font-size:11px;color:#7a7a86;letter-spacing:0.1em;">φ PHIMINDFLOW</div>
      <div style="font-size:11px;color:#4a4a56;margin-top:8px;">Structured wealth. Zero guesswork.</div>
    </div>
  </div>
</body>
</html>`;
}

// ─── GHL: tag contact ───────────────────────────────────────────────
async function updateGhlContact(email: string, product: string) {
  const GHL_TOKEN = process.env.GHL_PIT || '';
  const GHL_LOCATION = process.env.GHL_LOCATION || '';
  if (!GHL_TOKEN || !GHL_LOCATION) return;

  try {
    const searchRes = await fetch(
      `${GHL_API}/contacts/search/duplicate?locationId=${GHL_LOCATION}&email=${encodeURIComponent(email)}`,
      {
        headers: {
          Authorization: `Bearer ${GHL_TOKEN}`,
          Version: '2021-07-28',
        },
      }
    );
    const searchData = await searchRes.json();
    const contactId = searchData?.contact?.id;

    const tags = ['pmf-lead', 'purchase-confirmed', `product-${product}`, 'source-stripe'];

    if (contactId) {
      await fetch(`${GHL_API}/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${GHL_TOKEN}`,
          'Content-Type': 'application/json',
          Version: '2021-07-28',
        },
        body: JSON.stringify({ tags }),
      });
    } else {
      await fetch(`${GHL_API}/contacts/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GHL_TOKEN}`,
          'Content-Type': 'application/json',
          Version: '2021-07-28',
        },
        body: JSON.stringify({
          locationId: GHL_LOCATION,
          email,
          tags,
          source: 'PHIMINDFLOW — Stripe Webhook',
        }),
      });
    }
  } catch {
    // Non-blocking
  }
}

// ─── Stripe webhook handler ─────────────────────────────────────────
export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') || '';

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email || session.customer_email || '';
    const name = session.customer_details?.name || '';

    // Detect product from amount: $250 = course, $1500 = management
    const amount = session.amount_total || 0;
    const product = amount >= 100000 ? 'management' : 'course';

    if (email) {
      await Promise.allSettled([
        getResend().emails.send({
          from: 'PHIMINDFLOW <onboarding@phimindflow.com>',
          to: email,
          subject: `Welcome to PHIMINDFLOW — Your ${product === 'course' ? 'course' : 'managed execution'} is ready`,
          html: buildWelcomeEmail(name, product),
        }),
        updateGhlContact(email, product),
      ]);
    }
  }

  return NextResponse.json({ received: true });
}
