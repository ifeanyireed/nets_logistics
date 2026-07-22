import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { staggerContainer, staggerItem, slideInRight } from '@/lib/motion'

const vehicleOptions = [
  'Select Vehicle Type',
  'Toyota HiAce (14 Seats)',
  '18-Seater Shuttle',
  'Toyota Coaster (30 Seats)',
  '50-Seater Coach',
  'Executive SUV',
  'Executive Sedan',
]

export function HeroSection() {
  return (
    <section
      id="hero"
      aria-label="Hero — New Era Transport Services"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'var(--color-nets-navy-dark)',
      }}
    >
      {/* ── Full-bleed background photo ── */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920&q=90"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
          loading="eager"
          fetchPriority="high"
        />
        {/* Multi-layer cinematic overlay - Darker on left for text, completely transparent on right for vehicle prominence */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(105deg, rgba(13,16,96,0.95) 0%, rgba(13,16,96,0.7) 45%, rgba(13,16,96,0) 100%)',
        }} />
        {/* Bottom vignette */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,16,96,0.6) 0%, transparent 40%)' }} />
        {/* Red accent — thin left rule */}
        <div aria-hidden style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
          background: 'var(--color-nets-red)',
          zIndex: 10,
        }} />
      </div>

      {/* ── Content ── */}
      <div
        className="container-nets"
        style={{
          position: 'relative', zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '2rem',
          alignItems: 'center',
          paddingTop: '10rem',
          paddingBottom: '4rem',
          flex: 1
        }}
      >
        {/* ── Left — Editorial headline ── */}
        <motion.div
          style={{ gridColumn: 'span 12' }}
          className="lg:col-span-7"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Overline */}
          <motion.div variants={staggerItem} style={{ marginBottom: '1.5rem' }}>
            <span className="overline-dark">
              Nigeria's Premier Transport Partner
            </span>
          </motion.div>

          {/* Headline — editorial split (Reduced size and line height) */}
          <motion.h1 variants={staggerItem} className="fw-300" style={{ 
            color: '#fff', 
            marginBottom: '1rem', 
            fontSize: 'clamp(2.75rem, 4vw, 3.75rem)', 
            lineHeight: '1.1',
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap'
          }}>
            Premium Transport
            <br />
            <em style={{ fontStyle: 'normal', fontWeight: 700, color: '#fff' }}>Solutions</em>
            <br />
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>for Every Journey.</span>
          </motion.h1>

          {/* Body (Concise, moved up) */}
          <motion.p variants={staggerItem} style={{ 
            maxWidth: '460px', 
            marginBottom: '2rem', 
            fontSize: '1.125rem', 
            color: 'rgba(255,255,255,0.7)',
            lineHeight: '1.5'
          }}>
            Professional transport solutions for businesses, organisations and private travellers across Nigeria.
          </motion.p>

          {/* CTAs (Moved higher) */}
          <motion.div variants={staggerItem} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <Link to="/plan" className="btn btn-red btn-lg">
              Get Instant Quote
            </Link>
            <Link to="/plan" className="btn btn-outline-white btn-lg">
              Plan Your Journey
            </Link>
          </motion.div>

          {/* Trust badges (Compact and understated) */}
          <motion.div variants={staggerItem} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ color: 'var(--color-nets-red)', fontSize: '1rem', letterSpacing: '0.1em' }}>★★★★★</div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#fff' }}>4.9/5</div>
            <div style={{ width: '4px', height: '4px', background: 'rgba(255,255,255,0.3)', borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)', maxWidth: '280px', lineHeight: 1.4 }}>
              Trusted by businesses, organisations and private travellers across Nigeria.
            </div>
          </motion.div>
        </motion.div>

        {/* ── Right — Quote card ── */}
        <motion.div
          style={{ gridColumn: 'span 12', display: 'flex' }}
          className="lg:col-span-5 lg:col-start-8 lg:justify-end justify-center"
          variants={slideInRight}
          initial="hidden"
          animate="visible"
        >
          <div
            id="quote"
            style={{
              width: '100%',
              maxWidth: '420px',
              background: 'rgba(13,16,96,0.85)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '4px',
              padding: '1.5rem',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
              marginTop: '1.5rem'
            }}
          >
            {/* Card header */}
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.25rem' }}>
              <div className="overline-dark" style={{ marginBottom: '0.5rem' }}>Instant Quote</div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>
                Plan your journey
              </h2>
            </div>

            <form aria-label="Instant quote request" onSubmit={e => e.preventDefault()}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>

              <div>
                <label htmlFor="hero-pickup" className="field-label-dark">Pickup Location</label>
                <input id="hero-pickup" type="text" placeholder="e.g. Victoria Island, Lagos" className="input-dark" style={{ padding: '0.625rem 1rem' }} />
              </div>

              <div>
                <label htmlFor="hero-dest" className="field-label-dark">Destination</label>
                <input id="hero-dest" type="text" placeholder="e.g. Abuja, FCT" className="input-dark" style={{ padding: '0.625rem 1rem' }} />
              </div>

              {/* Trip type */}
              <div>
                <label className="field-label-dark" id="hero-trip-lbl">Trip Type</label>
                <div role="radiogroup" aria-labelledby="hero-trip-lbl"
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: '2px' }}>
                  {['One Way', 'Return', 'Multi-Day'].map((t, i) => (
                    <label key={t} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '0.5rem 0', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer',
                      borderRight: i < 2 ? '1px solid rgba(255,255,255,0.12)' : 'none',
                      color: i === 0 ? '#fff' : 'rgba(255,255,255,0.5)',
                      background: i === 0 ? 'rgba(192,39,45,0.3)' : 'transparent',
                    }}>
                      <input type="radio" name="hero-trip" value={t} defaultChecked={i === 0} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
                      {t}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label htmlFor="hero-date" className="field-label-dark">Travel Date</label>
                  <input id="hero-date" type="date" className="input-dark" style={{ padding: '0.625rem 1rem' }} />
                </div>
                <div>
                  <label htmlFor="hero-pax" className="field-label-dark">Passengers</label>
                  <select id="hero-pax" className="input-dark" style={{ padding: '0.625rem 1rem' }}>
                    {['1–7','8–14','15–18','19–30','31–50','50+'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="hero-veh" className="field-label-dark">Preferred Vehicle</label>
                <select id="hero-veh" className="input-dark" style={{ padding: '0.625rem 1rem' }}>
                  {vehicleOptions.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>

              <Link to="/plan" className="btn btn-red btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem', padding: '0.75rem 1.5rem' }}>
                Get Instant Quote
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
            </form>
          </div>
        </motion.div>
      </div>

    </section>
  )
}
