import { motion, AnimatePresence } from 'framer-motion'
import { useJourneyStore } from '@/store/useJourneyStore'

export function InternationalModal() {
  const { isInternationalModalOpen, setInternationalModalOpen } = useJourneyStore()

  if (!isInternationalModalOpen) return null

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(13,16,96,0.85)',
        backdropFilter: 'blur(8px)'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          style={{
            background: '#fff',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '400px',
            overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
            position: 'relative'
          }}
        >
          <button 
            onClick={() => setInternationalModalOpen(false)}
            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1, color: 'var(--color-nets-text-2)' }}
          >
            &times;
          </button>

          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(192,39,45,0.1)', color: 'var(--color-nets-red)', marginBottom: '1.5rem' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </div>
            
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-nets-navy-dark)', marginBottom: '0.5rem' }}>
              International Travel Request
            </h2>
            
            <p style={{ color: 'var(--color-nets-text-2)', marginBottom: '1.5rem', fontSize: '0.9375rem', lineHeight: 1.5 }}>
              While we offer comprehensive cross-border and international transport solutions, these routes require custom itinerary planning and cannot be booked instantly online.
            </p>

            <a 
              href="mailto:sales@netstransport.com?subject=International Travel Request"
              className="btn btn-red btn-lg" 
              style={{ width: '100%', justifyContent: 'center', border: 'none', textDecoration: 'none' }}
              onClick={() => setInternationalModalOpen(false)}
            >
              Contact Sales
            </a>
            
            <button 
              onClick={() => setInternationalModalOpen(false)}
              className="btn btn-outline-dark btn-lg" 
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem', border: '1px solid var(--color-nets-border)' }}
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
