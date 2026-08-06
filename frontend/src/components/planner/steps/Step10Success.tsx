import { motion } from 'framer-motion'
import { CheckCircle, Download, Home, Plus, Phone, Mail } from 'lucide-react'
import { useJourneyStore } from '../../../store/useJourneyStore'
import { fadeUp, staggerContainer } from '../../../lib/motion'
import { pdfService } from '../../../services/pdfService'
import { emailService } from '../../../services/emailService'
import { useState } from 'react'

export function Step10Success() {
  const state = useJourneyStore()
  const { referenceNumber, resetJourney, getCRMLeadPayload } = state
  const [emailSent, setEmailSent] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    try {
      const payload = {
        ...getCRMLeadPayload(),
        paymentInformation: { status: 'paid', paystackReference: `PAY-${referenceNumber}` }
      }
      await pdfService.generateQuotationPDF(payload)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleEmailCopy = async () => {
    if (emailSent) return
    const payload = {
      ...getCRMLeadPayload(),
      paymentInformation: { status: 'paid', paystackReference: `PAY-${referenceNumber}` }
    }
    await emailService.sendConfirmationEmail(payload)
    setEmailSent(true)
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem 0' }}>
      
      <motion.div variants={fadeUp} style={{ marginBottom: '2rem' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-nets-success-10, #E6F4EA)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', color: 'var(--color-nets-success, #22C55E)' }}>
          <CheckCircle size={40} />
        </div>
      </motion.div>

      <motion.h2 variants={fadeUp} style={{ fontSize: '2.5rem', fontWeight: 300, color: 'var(--color-nets-navy-dark)', marginBottom: '1rem', lineHeight: 1.2 }}>
        Payment Successful
      </motion.h2>
      
      <motion.p variants={fadeUp} style={{ fontSize: '1.125rem', color: 'var(--color-nets-text-2)', marginBottom: '0.5rem', maxWidth: '480px' }}>
        Thank you for choosing New Era Transport Services. Your booking is confirmed.
      </motion.p>
      
      <motion.p variants={fadeUp} style={{ fontSize: '1rem', color: 'var(--color-nets-text-3)', marginBottom: '3rem', maxWidth: '480px' }}>
        Our transport specialists will be in touch shortly with your driver details and operational schedule.
      </motion.p>

      <motion.div variants={fadeUp} style={{ background: 'var(--color-nets-light)', padding: '2rem', borderRadius: '4px', width: '100%', maxWidth: '480px', marginBottom: '3rem', border: '1px solid var(--color-nets-border)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-nets-text-3)', marginBottom: '0.25rem' }}>Booking Reference</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-nets-navy-dark)', letterSpacing: '0.05em' }}>{referenceNumber || 'NETS-PENDING'}</div>
          </div>
          <div style={{ height: '1px', background: 'var(--color-nets-border)' }} />
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-nets-text-3)', marginBottom: '0.25rem' }}>Next Steps</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--color-nets-success)' }}>Check your email for the receipt</div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '480px' }}>
        <button onClick={handleDownloadPDF} disabled={isDownloading} className="btn btn-navy" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }}>
          {isDownloading ? (
            <>
              <svg className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Generating Receipt...
            </>
          ) : (
            <>
              <Download size={18} /> Download Journey Receipt (PDF)
            </>
          )}
        </button>
        <button onClick={handleEmailCopy} disabled={emailSent} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', border: '2px solid var(--color-nets-border)', background: 'transparent', color: 'var(--color-nets-text-2)' }}>
          <Mail size={18} /> {emailSent ? 'Email Sent Successfully' : 'Email Me a Copy'}
        </button>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <a href="/" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none', border: '2px solid var(--color-nets-border)', color: 'var(--color-nets-text-2)' }}>
            <Home size={16} /> Return Home
          </a>
          <button onClick={resetJourney} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'transparent', border: '2px solid var(--color-nets-border)', color: 'var(--color-nets-text-2)', cursor: 'pointer' }}>
            <Plus size={16} /> Plan Another
          </button>
        </div>
        <a href="tel:+2348000000000" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--color-nets-red)', fontSize: '0.9375rem', fontWeight: 600, marginTop: '1rem', textDecoration: 'none' }}>
          <Phone size={16} /> Contact a Transport Specialist
        </a>
      </motion.div>

    </motion.div>
  )
}
