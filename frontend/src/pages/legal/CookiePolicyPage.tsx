import { LegalLayout } from './LegalLayout'

export function CookiePolicyPage() {
  return (
    <LegalLayout
      title="Cookie Policy"
      subtitle="How New Era Transport Services uses cookies and tracking technologies to ensure seamless bookings and services."
      effectiveDate="August 10, 2026"
      lastUpdated="August 10, 2026"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* Section 1 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            1. What Are Cookies
          </h2>
          <p>
            Cookies are small text files placed on your device when you visit a website. They help the site function properly, remember your preferences, and give us insight into how the site is used.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            2. Types of Cookies We Use
          </h2>
          <p style={{ marginBottom: '1.25rem' }}>
            We use both first-party and third-party cookies on our website for security, core booking operations, and analytical insights:
          </p>

          <div style={{ overflowX: 'auto', borderRadius: '6px', border: '1px solid #E2E8F0', marginBottom: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#0D1060', color: '#ffffff' }}>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 600, width: '22%' }}>Type</th>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 600, width: '48%' }}>Purpose</th>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 600, width: '30%' }}>Can you disable it?</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#0D1060' }}>Strictly Necessary</td>
                  <td style={{ padding: '0.875rem 1rem', color: '#475569' }}>
                    Required for core site functions — e.g. keeping your booking session active while you enter trip details and move to payment, security tokens, load balancing.
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#C0272D', fontWeight: 600 }}>
                    No — the site will not work correctly without these
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#0D1060' }}>Functional</td>
                  <td style={{ padding: '0.875rem 1rem', color: '#475569' }}>
                    Remember preferences such as language or previously entered pickup/drop-off locations, to make re-booking easier.
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#16A34A', fontWeight: 600 }}>
                    Yes, via cookie settings
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#0D1060' }}>Analytics</td>
                  <td style={{ padding: '0.875rem 1rem', color: '#475569' }}>
                    Help us understand how visitors use the site (e.g. pages visited, booking drop-off points) so we can improve it (e.g. Google Analytics, Meta Pixel).
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#16A34A', fontWeight: 600 }}>
                    Yes, via cookie settings
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#0D1060' }}>Payment</td>
                  <td style={{ padding: '0.875rem 1rem', color: '#475569' }}>
                    Set by our payment partner, Paystack, during checkout to securely process your payment.
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#C0272D', fontWeight: 600 }}>
                    No — required to complete payment
                  </td>
                </tr>
                <tr style={{ background: '#F8FAFC' }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#0D1060' }}>Marketing</td>
                  <td style={{ padding: '0.875rem 1rem', color: '#475569' }}>
                    Used to show relevant promotions or measure campaign performance.
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#16A34A', fontWeight: 600 }}>
                    Yes, via cookie settings
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            3. Third-Party Cookies
          </h2>
          <p style={{ marginBottom: '0.75rem' }}>
            Some cookies are set by third parties we work with, not by NETS directly:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>
              <strong>Paystack</strong> — sets cookies during the payment step to process your transaction securely. Governed by Paystack's own cookie and privacy policies.
            </li>
            <li>
              <strong>Analytics / marketing providers</strong> (if used) — governed by their respective privacy and tracking policies.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            4. Managing Cookies
          </h2>
          <p style={{ marginBottom: '0.75rem' }}>
            You can control or delete cookies through your browser settings. Most modern browsers let you:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            <li>View what cookies are stored and delete them individually</li>
            <li>Block cookies from specific or all sites</li>
            <li>Set your browser to notify you whenever a cookie is set</li>
          </ul>
          <div style={{ background: 'rgba(192, 39, 45, 0.05)', borderLeft: '4px solid #C0272D', padding: '1rem', borderRadius: '4px', fontSize: '0.9375rem' }}>
            Please note that blocking strictly necessary or payment cookies may prevent you from completing a vehicle booking or accessing secure features on our website.
          </div>
          <p style={{ marginTop: '1rem' }}>
            Where required by law, we will show a cookie consent banner when you first visit the site, allowing you to accept or manage non-essential cookies before they are set. You can review or update your choices at any time:
          </p>
          <div style={{ marginTop: '1rem' }}>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('nets_open_cookie_preferences'))}
              style={{
                background: '#0D1060',
                color: '#ffffff',
                border: 'none',
                padding: '0.625rem 1.25rem',
                borderRadius: '4px',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1A1FA8')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0D1060')}
            >
              Customize Cookie Preferences
            </button>
          </div>
        </section>

        {/* Section 5 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            5. Changes to This Policy
          </h2>
          <p>
            We may update this Cookie Policy as our website and tools change. The "Last Updated" date at the top of this document reflects the most recent revision.
          </p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            6. Contact Us
          </h2>
          <p>
            If you have questions about our use of cookies, please reach out to:
          </p>
          <div style={{ marginTop: '0.75rem', padding: '1rem', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
            <p><strong>Email:</strong> <a href="mailto:info@neweratransports.com" style={{ color: '#0D1060', fontWeight: 600 }}>info@neweratransports.com</a></p>
            <p style={{ marginTop: '0.25rem' }}><strong>Address:</strong> 2 Raji Rasaki Estate Rd, Amuwo Odofin, 102102, Lagos, Nigeria</p>
          </div>
        </section>

      </div>
    </LegalLayout>
  )
}
