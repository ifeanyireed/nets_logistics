import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'Services',   href: '/#services', isHash: true },
  { label: 'Fleet',      href: '/fleet',     isHash: false },
  { label: 'About',      href: '/#about',    isHash: true },
  { label: 'Industries', href: '/#industries', isHash: true },
  { label: 'Contact',    href: '/#contact',  isHash: true },
]

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <header
        role="banner"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          height: '72px',
          display: 'flex', alignItems: 'center',
          background: scrolled ? 'var(--color-nets-navy-dark)' : 'transparent',
          boxShadow: scrolled ? '0 1px 0 rgba(255,255,255,0.06)' : 'none',
          transition: 'background 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        <div className="container-nets" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>

          {/* Logo */}
          <Link to="/" aria-label="New Era Transport Services" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, gap: '3px' }}>
            <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
              NEW ERA
            </span>
            <span style={{ fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.22em', color: 'var(--color-nets-red)', textTransform: 'uppercase' }}>
              Transport Services
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }} className="hidden lg:flex">
            {navLinks.map(l => (
              l.isHash ? 
                <a key={l.label} href={l.href} className="nav-link">{l.label}</a> :
                <Link key={l.label} to={l.href} className="nav-link">{l.label}</Link>
            ))}
            <Link to="/plan" className="btn btn-red" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
              Plan Your Journey
            </Link>
          </nav>

          {/* Desktop actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }} className="hidden lg:flex">
            <a href="tel:+2348000000000" style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
              +234 800 000 0000
            </a>
            <a href="#quote" className="btn btn-red btn-sm">Get a Quote</a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            style={{ background: 'none', border: 'none', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '5px' }}
          >
            {[0,1,2].map(i => (
              <span key={i} style={{ display: 'block', width: '22px', height: '1.5px', background: '#fff' }} />
            ))}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div key="ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(13,16,96,0.7)' }} />

            <motion.div key="dr" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ duration: 0.28, ease: [0.4,0,0.2,1] }}
              role="dialog" aria-modal aria-label="Navigation"
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, width: '300px',
                zIndex: 300, background: 'var(--color-nets-navy-dark)',
                display: 'flex', flexDirection: 'column', padding: '2rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>NEW ERA</div>
                  <div style={{ fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--color-nets-red)', textTransform: 'uppercase', marginTop: '3px' }}>Transport Services</div>
                </div>
                <button onClick={() => setMobileOpen(false)} aria-label="Close"
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '1.25rem' }}>✕</button>
              </div>

              <nav style={{ flex: 1 }}>
                {navLinks.map((l, i) => {
                  const content = (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.2 }}
                      style={{ padding: '1rem 0', fontSize: '1.125rem', fontWeight: 500, color: 'rgba(255,255,255,0.8)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      {l.label}
                    </motion.div>
                  )
                  return l.isHash ? 
                    (<a key={l.label} href={l.href} onClick={() => setMobileOpen(false)} style={{ display: 'block' }}>{content}</a>) :
                    (<Link key={l.label} to={l.href} onClick={() => setMobileOpen(false)} style={{ display: 'block' }}>{content}</Link>)
                })}
              </nav>

              <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link to="/plan" onClick={() => setMobileOpen(false)} className="btn btn-red" style={{ width: '100%', justifyContent: 'center' }}>
                  Plan Your Journey
                </Link>
                <a href="#quote" className="btn btn-outline-white" style={{ width: '100%', justifyContent: 'center' }}>
                  Get Instant Quote
                </a>
                <a href="tel:+2348000000000" style={{ textAlign: 'center', fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', padding: '0.5rem' }}>
                  +234 800 000 0000
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
