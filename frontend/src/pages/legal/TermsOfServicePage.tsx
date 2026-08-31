import { LegalLayout } from './LegalLayout'

export function TermsOfServicePage() {
  return (
    <LegalLayout
      title="Terms of Service"
      subtitle="The contractual terms and conditions governing your use of New Era Transport Services fleet, vehicle bookings, and online reservations."
      effectiveDate="August 10, 2026"
      lastUpdated="August 10, 2026"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* Section 1 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            1. Acceptance of Terms
          </h2>
          <p>
            These Terms of Service ("Terms") govern your access to and use of the NETS website and your booking of any trip, vehicle, or transport service through it. By using the website or completing a booking, you agree to be bound by these Terms. If you do not agree, please do not use the website or book services through our platform.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            2. Our Service
          </h2>
          <p style={{ marginBottom: '0.75rem' }}>
            NETS provides vehicle rental, executive charters, staff transport, and tailored road trip booking services across Nigeria. Through our website, you can:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>Enter trip details (pickup/start location and drop-off/stop location).</li>
            <li>Provide your name, email address, and phone number for booking coordination.</li>
            <li>Book an executive vehicle or commercial bus for a scheduled itinerary.</li>
            <li>Pay for the trip online securely via our licensed payment partner, Paystack.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            3. Eligibility
          </h2>
          <p>
            You must be at least 18 years old and legally capable of entering a binding contract under Nigerian law to book a trip on our website. By booking, you confirm that all information you provide (name, contact details, trip itinerary, passenger numbers) is accurate and complete.
          </p>
        </section>

        {/* Section 4 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            4. Booking Process
          </h2>
          <p style={{ marginBottom: '0.75rem' }}>
            The booking procedure on NETS follows these formal steps:
          </p>
          <ol style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>You submit trip details, including start and stop locations, date/time, and vehicle category.</li>
            <li>You provide your name, email, and contact phone number.</li>
            <li>You review the estimated investment and fare quote shown before payment.</li>
            <li>You complete payment via the secure Paystack checkout gateway.</li>
            <li>You receive a formal booking confirmation and reference number by email and/or SMS.</li>
          </ol>
          <p style={{ marginTop: '0.75rem' }}>
            A booking is only confirmed once payment has been successfully processed. NETS reserves the right to decline or cancel a booking where information provided is inaccurate, the requested trip is not feasible (e.g. outside our coverage area), or payment cannot be verified.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            5. Pricing and Payment
          </h2>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>All prices are displayed and billed in <strong>Nigerian Naira (NGN)</strong> unless explicitly stated otherwise.</li>
            <li>Payment is processed securely through Paystack; NETS does not store your card or banking credentials.</li>
            <li>The price shown at checkout is the price charged; any additional charges (e.g. extended waiting time, route diversions, overnight driver retention requested during the trip) will be communicated and agreed upon before being applied.</li>
            <li>It is your responsibility to ensure your payment details are valid and sufficient funds are available.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            6. Cancellations and Refunds
          </h2>
          <p>
            Cancellation, rescheduling, and refund requests are governed by our official Refund & Cancellation Policy. If you need to modify or cancel a scheduled booking, please contact our dispatch team at <a href="mailto:info@neweratransports.com" style={{ color: '#0D1060', fontWeight: 600 }}>info@neweratransports.com</a> as early as possible.
          </p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            7. Your Responsibilities
          </h2>
          <p style={{ marginBottom: '0.75rem' }}>
            When booking and traveling with NETS, you agree to:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>Provide accurate pickup/drop-off locations and reachable contact information.</li>
            <li>Be present and available at the agreed pickup location and scheduled departure time.</li>
            <li>Treat drivers, operational staff, fellow passengers, and vehicles with respect.</li>
            <li>Not use the service for any unlawful, hazardous, or fraudulent purpose.</li>
            <li>Not transport prohibited, hazardous, flammable, or illegal items in the vehicle.</li>
            <li>Comply with all reasonable instructions given by the driver relating to vehicle and passenger safety.</li>
          </ul>
          <p style={{ marginTop: '0.75rem' }}>
            We reserve the right to refuse or immediately terminate service to any passenger who behaves in a manner that is abusive, unsafe, or unlawful, without refund where the passenger is at fault.
          </p>
        </section>

        {/* Section 8 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            8. Vehicles, Drivers, and Service Standards
          </h2>
          <p style={{ marginBottom: '0.75rem' }}>
            NETS will make every reasonable operational effort to:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>Provide a clean, roadworthy, air-conditioned, and appropriately insured and licensed vehicle.</li>
            <li>Assign a licensed, vetted, and competent professional driver.</li>
            <li>Arrive at the designated pickup point within a reasonable window of the scheduled time.</li>
          </ul>
          <p style={{ marginTop: '0.75rem' }}>
            Unforeseen delays may occur due to extreme traffic congestion, road construction, weather conditions, or unforeseen mechanical events. NETS will proactively communicate significant delays whenever they occur.
          </p>
        </section>

        {/* Section 9 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            9. Liability
          </h2>
          <p style={{ marginBottom: '0.75rem' }}>
            To the fullest extent permitted by Nigerian law:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>NETS is not liable for indirect, incidental, or consequential loss (including missed flights, events, or third-party appointments) arising from road delays outside our reasonable control.</li>
            <li>NETS's total liability for any claim relating to a journey is limited to the total amount paid for that specific booking, except in cases of death, personal injury, or gross negligence caused directly by NETS or its driver, where liability cannot be limited by law.</li>
            <li>NETS is not responsible for personal items left in the vehicle after a trip, though reasonable efforts will be made to assist in recovery.</li>
          </ul>
        </section>

        {/* Section 10 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            10. Force Majeure
          </h2>
          <p>
            NETS is not liable for failure or delay in performing its contractual obligations where caused by events beyond its reasonable control, including but not limited to natural disasters, civil unrest, acts of government, strikes, curfews, road closures, or severe weather.
          </p>
        </section>

        {/* Section 11 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            11. Intellectual Property
          </h2>
          <p>
            All content on the NETS website — including text, logos, branding, graphics, icons, and software — is the property of New Era Transport Services Ltd or its licensors and may not be copied, reproduced, or used without prior written authorization.
          </p>
        </section>

        {/* Section 12 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            12. Changes to These Terms
          </h2>
          <p>
            We may update these Terms from time to time. Continued use of the website or booking of a journey after updates take effect constitutes acceptance of the amended Terms.
          </p>
        </section>

        {/* Section 13 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            13. Governing Law and Dispute Resolution
          </h2>
          <p>
            These Terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any dispute arising from these Terms or your use of our service shall first be addressed through amicable good-faith negotiation, and if unresolved, shall be submitted to the exclusive jurisdiction of the competent courts in Lagos State, Nigeria.
          </p>
        </section>

        {/* Section 14 */}
        <section>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1060', marginBottom: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            14. Contact Us
          </h2>
          <p>
            For questions or notices relating to these Terms:
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
