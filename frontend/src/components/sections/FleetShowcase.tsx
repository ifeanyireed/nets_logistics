import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { vehicles } from '@/data/vehicles'
import { staggerContainer, staggerItem, fadeUp } from '@/lib/motion'

export function FleetShowcase() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.08 })

  // Split fleet: first 2 large, rest standard
  const [featured1, featured2, ...rest] = vehicles

  return (
    <section
      id="fleet" ref={ref}
      aria-labelledby="fleet-heading"
      style={{ background: 'var(--color-nets-navy-dark)', position: 'relative', overflow: 'hidden' }}
    >
      {/* Noise texture overlay */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(26,31,168,0.3) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div className="container-nets section-py-xl" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem', marginBottom: '5rem' }}
        >
          <div style={{ maxWidth: '520px' }}>
            <div className="overline-dark" style={{ marginBottom: '1.5rem' }}>Our Fleet</div>
            <h2 id="fleet-heading" className="text-d2 fw-300" style={{ color: '#fff' }}>
              The right vehicle
              <br /><strong style={{ fontWeight: 700 }}>for every journey.</strong>
            </h2>
          </div>
          <a href="#" className="btn btn-outline-white">View Full Fleet</a>
        </motion.div>

        {/* ── Editorial fleet layout — asymmetric ── */}

        {/* Row 1: Two large featured vehicles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '1.5rem' }} className="lg:grid-cols-2">
          {[featured1, featured2].map((v) => (
            <motion.article
              key={v.id}
              variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
              style={{
                position: 'relative',
                borderRadius: '3px',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'border-color 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(192,39,45,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              aria-label={`${v.name} — ${v.capacity} seats`}
            >
              {/* Photo */}
              <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
                <img
                  src={v.imageUrl} alt={`${v.name}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  loading="lazy"
                />
                <div aria-hidden style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(13,16,96,0.8) 0%, transparent 55%)',
                }} />
                {/* Capacity badge top-right */}
                <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                  <span className="badge badge-red">{v.capacity} seats</span>
                </div>
              </div>
              {/* Details */}
              <div style={{ padding: '1.75rem 2rem' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem' }}>
                  {v.category}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>{v.name}</h3>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', marginBottom: '1.5rem' }}>{v.bestFor}</p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  {v.features.slice(0, 3).map(f => (
                    <span key={f} style={{
                      fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)',
                      border: '1px solid rgba(255,255,255,0.12)', borderRadius: '2px', padding: '0.2rem 0.6rem',
                    }}>{f}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
                  <a href="#" className="btn btn-ghost-white btn-sm" style={{ flex: 1, justifyContent: 'center' }}>View Details</a>
                  <a href="#quote" className="btn btn-red btn-sm" style={{ flex: 1, justifyContent: 'center' }}>Get Quote</a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Row 2: Remaining vehicles — compact list */}
        <motion.div
          variants={staggerContainer} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '1px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '3px',
            overflow: 'hidden',
          }}
          className="sm:grid-cols-2 lg:grid-cols-4"
        >
          {rest.map(v => (
            <motion.article
              key={v.id}
              variants={staggerItem}
              style={{
                background: 'rgba(255,255,255,0.02)',
                padding: '1.75rem',
                transition: 'background 0.15s ease',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(192,39,45,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
                  {v.category}
                </span>
                <span className="badge badge-navy" style={{ background: 'rgba(26,31,168,0.5)', fontSize: '0.65rem' }}>
                  {v.capacity} seats
                </span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>{v.name}</h3>
              <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{v.bestFor}</p>
              <a href="#quote" className="btn-ghost-white btn" style={{ fontSize: '0.8125rem', fontWeight: 600, marginTop: 'auto' }}>
                Get Quote →
              </a>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
