import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAlert, Phone, Shield } from 'lucide-react'
import type { ShuttleBooking } from '../../types/shuttle'

interface SosModalProps {
  isOpen: boolean
  booking: ShuttleBooking
  onClose: () => void
}

export function SosModal({ isOpen, booking, onClose }: SosModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 999,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(6px)'
            }}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
              width: '90%',
              maxWidth: '480px',
              background: '#fff',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              borderTop: '6px solid var(--color-nets-red)'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#fee2e2',
                color: 'var(--color-nets-red)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <ShieldAlert size={32} />
              </div>
              <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-nets-navy)' }}>
                EMERGENCY ASSISTANCE
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>
                Your current GPS location and trip details will be immediately dispatched to NETS Control Center & Emergency Response.
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.8125rem', color: '#334155' }}>
              <div><strong>Booking Ref:</strong> {booking.bookingRef}</div>
              <div><strong>Vehicle:</strong> {booking.vehicleType} ({booking.vehiclePlate})</div>
              <div><strong>Driver:</strong> {booking.driverName} ({booking.driverPhone})</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a
                href="tel:112"
                className="btn btn-red"
                style={{ width: '100%', justifyContent: 'center', padding: '0.875rem', fontSize: '1rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Phone size={18} />
                <span>Call National Emergency (112)</span>
              </a>

              <a
                href="tel:+2349167919439"
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'center', padding: '0.875rem', fontSize: '0.9375rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Shield size={18} />
                <span>Contact NETS 24/7 Control Room</span>
              </a>

              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '0.875rem',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  marginTop: '0.5rem'
                }}
              >
                Cancel / False Alarm
              </button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
