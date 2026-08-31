import { LegalLayout } from './LegalLayout'

export function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="How New Era Transport Services collects, uses, and safeguards your personal data in accordance with the Nigeria Data Protection Act, 2023 (NDPA)."
      effectiveDate="August 10, 2026"
      lastUpdated="August 10, 2026"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* Section 1 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            1. Introduction
          </h2>
          <p style={{ marginBottom: '0.75rem' }}>
            New Era Transport Services ("NETS", "we", "us", "our") operates a website that allows customers to book vehicle trips, including entering pickup and drop-off locations, and to pay for those trips online. This Privacy Policy explains what personal data we collect when you use our website, why we collect it, how we use and protect it, and what rights you have over it.
          </p>
          <p style={{ marginBottom: '0.75rem' }}>
            This Policy is issued in line with the <strong>Nigeria Data Protection Act, 2023 (NDPA)</strong> and applicable regulations issued by the Nigeria Data Protection Commission (NDPC).
          </p>
          <p>
            By using our website or booking a trip with us, you agree to the practices described in this Policy.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            2. Who We Are
          </h2>
          <p style={{ marginBottom: '0.75rem' }}>
            NETS is a premier road transport and fleet logistics provider. For data protection purposes, NETS is the "Data Controller" of the personal data described below:
          </p>
          <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <div><strong>Company Name:</strong> New Era Transport Services Ltd</div>
            <div><strong>Registered Address:</strong> 2 Raji Rasaki Estate Rd, Amuwo Odofin, 102102, Lagos, Nigeria</div>
            <div><strong>General Contact:</strong> <a href="mailto:info@neweratransports.com" style={{ color: '#0D1060', fontWeight: 600 }}>info@neweratransports.com</a></div>
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            3. Information We Collect
          </h2>
          <p style={{ marginBottom: '0.75rem' }}>
            When you book a trip or interact on our website, we collect:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            <li>
              <strong>Identity and contact information:</strong> Full name, email address, phone number, and organization name (where applicable).
            </li>
            <li>
              <strong>Trip information:</strong> Pickup (start) location, drop-off (stop) location, travel date and time, number of passengers, and vehicle category selected.
            </li>
            <li>
              <strong>Payment information:</strong> Payment is processed directly by our licensed payment partner, Paystack. We receive confirmation of payment status and a transaction reference; we do not collect or store your full card number, CVV, or PIN on our servers.
            </li>
            <li>
              <strong>Technical information:</strong> IP address, browser type, device information, and cookies/similar technologies (see our Cookie Policy).
            </li>
            <li>
              <strong>Communications:</strong> Messages, feedback, or inquiries you send us via email, phone, or website contact forms.
            </li>
          </ul>
          <p style={{ marginTop: '0.75rem' }}>
            We do not knowingly collect more information than is necessary to fulfil a booking, process payment, and provide high-standard customer service.
          </p>
        </section>

        {/* Section 4 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            4. How We Use Your Information
          </h2>
          <p style={{ marginBottom: '0.75rem' }}>
            We use your personal data to:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>Create and manage your trip booking (route coordination, schedule confirmation, vehicle assignment).</li>
            <li>Process payment for your trip through Paystack.</li>
            <li>Send instant booking confirmations, itinerary updates, receipts, and service reminders.</li>
            <li>Provide dedicated customer support and respond to inquiries or complaints.</li>
            <li>Assign qualified drivers/vehicles and coordinate pickup and drop-off logistics.</li>
            <li>Detect and prevent fraud, unauthorized transactions, abuse, and security incidents.</li>
            <li>Comply with legal, accounting, tax, and regulatory obligations.</li>
            <li>Improve our website and operational fleet efficiency (in aggregated and anonymised form).</li>
            <li>With your consent, send you promotional messages about NETS services (you may opt out at any time).</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            5. Legal Basis for Processing
          </h2>
          <p style={{ marginBottom: '0.75rem' }}>
            Under the Nigeria Data Protection Act (NDPA), we rely on one or more of the following legal bases:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><strong>Performance of a Contract:</strong> To process your journey booking and deliver the transport service requested.</li>
            <li><strong>Consent:</strong> For optional communications such as marketing newsletters and non-essential cookies.</li>
            <li><strong>Legitimate Interests:</strong> For fraud prevention, cybersecurity, operational safety, and service improvement.</li>
            <li><strong>Legal Obligation:</strong> For tax, accounting, audit, and regulatory record-keeping requirements.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            6. How We Share Your Information
          </h2>
          <p style={{ marginBottom: '0.75rem' }}>
            We do not sell your personal data. We share it only where strictly necessary:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            <li>
              <strong>Paystack (Payment Processor):</strong> To process your payment securely. Paystack is licensed by the Central Bank of Nigeria and is PCI-DSS Level 1 compliant. Your payment card details are entered directly into Paystack's secure checkout.
            </li>
            <li>
              <strong>Drivers and Operations Staff:</strong> Trip details (pickup/drop-off, passenger name, contact phone number) are shared internally with the assigned driver and dispatch team strictly to fulfil the booking.
            </li>
            <li>
              <strong>Service Providers:</strong> Cloud infrastructure hosts, SMS/email gateway providers, and IT support contractors engaged under strict confidentiality obligations.
            </li>
            <li>
              <strong>Regulators and Law Enforcement:</strong> Where required by law, court order, or official statutory inquiry to protect the rights, safety, or property of NETS, passengers, or the public.
            </li>
            <li>
              <strong>Corporate Clients (where applicable):</strong> For staff transport or corporate shuttle bookings made on behalf of an enterprise client, relevant trip completion data may be shared with that client for billing and audit reporting.
            </li>
          </ul>
        </section>

        {/* Section 7 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            7. Payment Security
          </h2>
          <p>
            All online transactions on this platform are processed through Paystack's secure checkout infrastructure. NETS does not store your full payment card number, CVV, or PIN on our servers. Transactions are encrypted using industry-standard TLS protocols.
          </p>
        </section>

        {/* Section 8 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            8. Cookies
          </h2>
          <p>
            Our website uses cookies and similar technologies to ensure seamless operation, remember trip preferences, and evaluate website performance. For comprehensive details on the cookies we set and how to manage them, please review our separate <a href="/cookies" style={{ color: '#0D1060', fontWeight: 600 }}>Cookie Policy</a>.
          </p>
        </section>

        {/* Section 9 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            9. Data Retention
          </h2>
          <p style={{ marginBottom: '0.75rem' }}>
            We retain your personal data only for as long as necessary to:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>Fulfil the booking purposes for which it was gathered (e.g. completing and supporting your journey).</li>
            <li>Meet statutory tax, financial auditing, and accounting record-keeping requirements (typically 6 years for financial transaction records).</li>
            <li>Resolve disputes and enforce contractual terms.</li>
          </ul>
          <p style={{ marginTop: '0.75rem' }}>
            When data is no longer needed, it is securely destroyed, deleted, or permanently anonymised.
          </p>
        </section>

        {/* Section 10 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            10. Data Security
          </h2>
          <p>
            We implement comprehensive technical and organisational security measures to protect your personal data against unauthorized access, loss, misuse, or alteration. These include encrypted network transmission (HTTPS/TLS), database access controls, authentication firewalls, and restricted employee access to sensitive booking records.
          </p>
        </section>

        {/* Section 11 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            11. Your Rights
          </h2>
          <p style={{ marginBottom: '0.75rem' }}>
            Under the Nigeria Data Protection Act, 2023, you have the right to:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><strong>Be informed:</strong> About how your personal data is collected and processed (this Policy).</li>
            <li><strong>Access:</strong> Request copies of the personal data we hold about you.</li>
            <li><strong>Rectification:</strong> Request correction of inaccurate, incomplete, or outdated data.</li>
            <li><strong>Erasure:</strong> Request deletion of your data, subject to legal and regulatory retention obligations.</li>
            <li><strong>Object or Restrict:</strong> Object to processing for direct marketing or restrict certain processing activities.</li>
            <li><strong>Withdraw Consent:</strong> Withdraw your consent at any time where processing is based on consent.</li>
            <li><strong>Lodge a Complaint:</strong> Lodge a formal complaint with the Nigeria Data Protection Commission (NDPC).</li>
          </ul>
          <p style={{ marginTop: '0.75rem' }}>
            To exercise any of these rights, please contact our Data Protection Officer at <a href="mailto:info@neweratransports.com" style={{ color: '#0D1060', fontWeight: 600 }}>info@neweratransports.com</a>.
          </p>
        </section>

        {/* Section 12 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            12. International Data Transfers
          </h2>
          <p>
            Where our website hosting servers, database backups, or third-party communications tools are located outside Nigeria, your data may be transferred internationally. In all such cases, we ensure the transfer complies with NDPA cross-border transfer provisions, including verifying adequate data protection standards and contractual safeguards.
          </p>
        </section>

        {/* Section 13 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            13. Children's Privacy
          </h2>
          <p>
            Our website and online booking services are directed at individuals aged 18 and older. We do not knowingly collect personal data from minors. If you believe a minor has provided us with personal data without guardian consent, please contact us immediately for prompt deletion.
          </p>
        </section>

        {/* Section 14 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            14. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy periodically to reflect changes in our operational procedures or relevant legal standards. The "Last Updated" date at the top of this document indicates when changes were made.
          </p>
        </section>

        {/* Section 15 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            15. Contact Us
          </h2>
          <p>
            For questions, data access requests, or privacy inquiries:
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
