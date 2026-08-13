import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Zap, Wifi, ShieldCheck, ArrowRight } from 'lucide-react'
import { mockShuttleRoutes } from '../../data/shuttleData'

export function ShuttleHeroCard() {
  return (
    <section 
      style={{ 
        padding: '5rem 0', 
        background: 'var(--color-nets-navy-dark)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background glow accent */}
      <div 
        style={{ 
          position: 'absolute', 
          top: '-10%', 
          right: '-5%', 
          width: '500px', 
          height: '500px', 
          background: 'radial-gradient(circle, rgba(192, 39, 45, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }} 
      />

      <div className="container-nets" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2.5rem', alignItems: 'center' }}>
          
          {/* Left Text Blurb */}
          <motion.div 
            className="col-span-12 lg:col-span-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="overline-dark" style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={14} color="var(--color-nets-red)" />
              <span>Scheduled Express Shuttles</span>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: '1.25rem' }}>
              Book a seat in minutes.<br />
              <span style={{ color: 'var(--color-nets-red)' }}>Fixed schedules, pure comfort.</span>
            </h2>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '520px' }}>
              Experience hassle-free daily commuting and city-to-city transport. Reserve your preferred stop, track your shuttle live on map, and travel with guaranteed air-conditioned comfort.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/shuttles" className="btn btn-red btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Book a Shuttle Seat</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/shuttles/account" className="btn btn-outline-white btn-lg">
                My Bookings & Pass
              </Link>
            </div>
          </motion.div>

          {/* Right Preview Card */}
          <motion.div 
            className="col-span-12 lg:col-span-6"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div style={{
              background: 'rgba(13, 16, 96, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              padding: '1.75rem',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-nets-red)', fontWeight: 600 }}>Popular Express Line</span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginTop: '0.25rem' }}>
                    {mockShuttleRoutes[0].name}
                  </h3>
                </div>
                <span style={{ background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.75rem', borderRadius: '12px', border: '1px solid rgba(74, 222, 128, 0.3)' }}>
                  Live Status: Active
                </span>
              </div>

              {/* Route snippet preview */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.04)', padding: '1rem', borderRadius: '6px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#4ade80', border: '2px solid #fff' }} />
                  <div style={{ width: '2px', height: '24px', background: 'rgba(255,255,255,0.2)' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--color-nets-red)', border: '2px solid #fff' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Origin</div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#fff' }}>{mockShuttleRoutes[0].origin}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Destination</div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#fff' }}>{mockShuttleRoutes[0].destination}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Starting Fare</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-nets-red)' }}>₦{mockShuttleRoutes[0].startingFare.toLocaleString()}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>Next: {mockShuttleRoutes[0].nextDeparture}</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Wifi size={14} /> Free WiFi • A/C • Live GPS Tracking
                </span>
                <Link to="/shuttles" className="btn btn-red btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Choose Route & Seats</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
