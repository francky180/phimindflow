export default function PrivacyPolicy() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p className="meta">Last updated: April 28, 2026</p>

      <p>This Privacy Policy explains how PHIMINDFLOW (&quot;we&quot;, &quot;us&quot;) collects, uses, stores, and protects your personal and financial information when you use the credit-restoration tools at phimindflow.com/credit (the &quot;Service&quot;).</p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li><strong>Account information:</strong> name, email, password (hashed), phone, mailing address.</li>
        <li><strong>Credit-restoration data:</strong> credit scores you log, negative items you track, dispute letters you draft, and credit reports / IDs / proof-of-address documents you upload.</li>
        <li><strong>Sensitive identifiers (optional):</strong> date of birth and last 4 digits of SSN — used only to populate dispute letters at your direction.</li>
        <li><strong>Usage data:</strong> standard server logs (IP, user-agent, page accessed) for security and abuse prevention.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To provide the Service: store your dashboard data, generate dispute letters, hold your uploaded documents.</li>
        <li>To communicate with you about your account (password resets, security alerts, important updates).</li>
        <li>To comply with legal obligations and respond to lawful requests.</li>
      </ul>
      <p>We do <strong>not</strong> sell your personal information. We do not share it with third parties for advertising.</p>

      <h2>3. How We Protect Your Information</h2>
      <ul>
        <li>Encryption in transit (HTTPS) on every page.</li>
        <li>Encryption at rest on the database and file storage layer (Supabase + AWS infrastructure).</li>
        <li>Per-user row-level security: each account can only read or write its own data — verified at the database level.</li>
        <li>File uploads stored in a private bucket scoped to your user folder. Files are not publicly addressable.</li>
        <li>Passwords stored as hashes (we cannot read your password).</li>
      </ul>

      <h2>4. Subprocessors</h2>
      <ul>
        <li><strong>Supabase</strong> (auth, database, storage)</li>
        <li><strong>Vercel</strong> (web hosting and serverless functions)</li>
        <li><strong>Stripe</strong> (payment processing for paid tiers; we never see or store your card numbers)</li>
        <li><strong>Resend</strong> (transactional email delivery)</li>
        <li><strong>LetterStream</strong> (when you opt in to mailed dispute delivery)</li>
      </ul>

      <h2>5. Your Rights</h2>
      <p>You can: export your data, correct it, or delete your account at any time by emailing <a href="mailto:franckydelissaint@gmail.com">franckydelissaint@gmail.com</a>. We will permanently remove your data within 30 days of a deletion request, except where retention is required by law.</p>
      <p>California residents (CCPA) and New York residents (SHIELD Act) have additional rights — including the right to know, the right to delete, and the right to non-discrimination for exercising those rights.</p>

      <h2>6. Data Retention</h2>
      <p>We retain your data while your account is active. If you delete your account, we permanently delete your dashboard data and uploaded files within 30 days. Backups are retained for an additional 7 days then permanently destroyed.</p>

      <h2>7. Children</h2>
      <p>The Service is not directed at people under 18. We do not knowingly collect data from minors.</p>

      <h2>8. Changes</h2>
      <p>We will post changes to this policy on this page with a new &quot;last updated&quot; date. Material changes will be communicated by email.</p>

      <h2>9. Contact</h2>
      <p>Questions: <a href="mailto:franckydelissaint@gmail.com">franckydelissaint@gmail.com</a></p>
    </>
  );
}
