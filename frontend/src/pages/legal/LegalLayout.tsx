import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Shield, FileText, Cookie, ChevronRight, Mail, MapPin } from 'lucide-react'

interface LegalLayoutProps {
  title: string
  subtitle: string
  effectiveDate: string
  lastUpdated: string
  children: ReactNode
}

const legalTabs = [
  { path: '/privacy', label: 'Privacy Policy', icon: Shield },
  { path: '/terms', label: 'Terms of Service', icon: FileText },
  { path: '/cookies', label: 'Cookie Policy', icon: Cookie },
]

export function LegalLayout({
  title,
  subtitle,
  effectiveDate,
  lastUpdated,
  children,
}: LegalLayoutProps) {
  const location = useLocation()

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', color: '#1E293B' }}>
      {/* Hero Header */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0D1060 0%, #1A1FA8 100%)',
          color: '#ffffff',
          paddingTop: '9rem',
          paddingBottom: '4rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.6,
          }}
        />

        <div className="container-nets" style={{ position: 'relative', zIndex: 1 }}>
          {/* Breadcrumbs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '1.5rem',
            }}
          >
            <Link to="/" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>
              Home
            </Link>
            <ChevronRight size={14} />
            <span style={{ color: '#ffffff', fontWeight: 600 }}>Legal</span>
            <ChevronRight size={14} />
            <span style={{ color: '#ffffff', fontWeight: 600 }}>{title}</span>
          </div>

          <div style={{ maxWidth: '800px' }}>
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(192, 39, 45, 0.3)',
                border: '1px solid rgba(192, 39, 45, 0.6)',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '0.35rem 0.75rem',
                borderRadius: '2px',
                marginBottom: '1rem',
              }}
            >
              Legal & Compliance
            </span>
            <h1
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                marginBottom: '1rem',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: '1.125rem',
                color: 'rgba(255, 255, 255, 0.85)',
                lineHeight: 1.6,
                marginBottom: '1.5rem',
              }}
            >
              {subtitle}
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.5rem',
                fontSize: '0.875rem',
                color: 'rgba(255, 255, 255, 0.7)',
                borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                paddingTop: '1rem',
              }}
            >
              <div>
                <strong>Effective Date:</strong> {effectiveDate}
              </div>
              <div>
                <strong>Last Updated:</strong> {lastUpdated}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Policy Navigation Tabs */}
      <div
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #E2E8F0',
          position: 'sticky',
          top: '64px',
          zIndex: 20,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div className="container-nets">
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              overflowX: 'auto',
              padding: '0.5rem 0',
            }}
          >
            {legalTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = location.pathname === tab.path || location.pathname.startsWith(tab.path)
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.625rem 1.25rem',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                    background: isActive ? '#0D1060' : 'transparent',
                    color: isActive ? '#ffffff' : '#64748B',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = '#F1F5F9'
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <Icon size={16} color={isActive ? '#ffffff' : '#64748B'} />
                  {tab.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container-nets" style={{ padding: '3.5rem 1.5rem 6rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 320px',
            gap: '3rem',
            alignItems: 'start',
          }}
        >
          {/* Document Content Card */}
          <article
            style={{
              background: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              padding: 'clamp(1.5rem, 4vw, 3.5rem)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
              lineHeight: 1.75,
              fontSize: '1rem',
              color: '#334155',
            }}
          >
            {children}
          </article>

          {/* Quick Contact & Summary Sidebar */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '130px' }}>
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)',
              }}
            >
              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#0D1060',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Shield size={18} color="#C0272D" /> Legal Inquiries
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                If you have any questions regarding our terms, data protection policies, or cookie preferences, please contact our legal team:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.875rem' }}>
                <a
                  href="mailto:info@neweratransports.com"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    color: '#0D1060',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  <Mail size={16} color="#C0272D" /> info@neweratransports.com
                </a>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', color: '#64748B' }}>
                  <MapPin size={16} color="#C0272D" style={{ flexShrink: 0, marginTop: 3 }} />
                  <span>2 Raji Rasaki Estate Rd, Amuwo Odofin, 102102, Lagos, Nigeria</span>
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(26, 31, 168, 0.04)',
                border: '1px solid rgba(26, 31, 168, 0.12)',
                borderRadius: '8px',
                padding: '1.25rem',
                fontSize: '0.8125rem',
                color: '#475569',
                lineHeight: 1.6,
              }}
            >
              <strong style={{ color: '#0D1060', display: 'block', marginBottom: '0.25rem' }}>Regulatory Compliance</strong>
              All services and agreements are governed by the laws of the Federal Republic of Nigeria and the Nigeria Data Protection Act, 2023 (NDPA).
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
