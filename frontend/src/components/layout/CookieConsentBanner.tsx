import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Cookie, ShieldCheck, X, SlidersHorizontal, Lock } from 'lucide-react'

export interface CookiePreferences {
  necessary: boolean
  payment: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
  timestamp: string
}

const STORAGE_KEY = 'nets_cookie_consent'

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  payment: true,
  functional: true,
  analytics: true,
  marketing: false,
  timestamp: '',
}

export function CookieConsentBanner() {
  const [isOpen, setIsOpen] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES)

  // Initialize on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsed })
        setIsOpen(false)
      } else {
        // Small delay for smooth entry on first load
        const timer = setTimeout(() => setIsOpen(true), 800)
        return () => clearTimeout(timer)
      }
    } catch {
      setIsOpen(true)
    }
  }, [])

  // Listen for manual trigger to reopen preferences from Footer or Policy page
  useEffect(() => {
    const handleOpen = () => {
      setShowPreferences(true)
      setIsOpen(true)
    }
    window.addEventListener('nets_open_cookie_preferences', handleOpen)
    return () => window.removeEventListener('nets_open_cookie_preferences', handleOpen)
  }, [])

  const saveConsent = (prefs: CookiePreferences) => {
    const updated = {
      ...prefs,
      necessary: true,
      payment: true,
      timestamp: new Date().toISOString(),
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (err) {
      console.warn('[COOKIE BANNER] Failed to save cookie consent:', err)
    }
    setPreferences(updated)
    setIsOpen(false)
    setShowPreferences(false)
  }

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      payment: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: '',
    })
  }

  const handleRejectNonEssential = () => {
    saveConsent({
      necessary: true,
      payment: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: '',
    })
  }

  const handleSaveCustom = () => {
    saveConsent(preferences)
  }

  if (!isOpen) return null

  return (
    <>
      {/* ── Granular Preferences Modal ── */}
      {showPreferences && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPreferences(false)
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '8px',
              maxWidth: '640px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.3)',
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                background: '#F8FAFC',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <SlidersHorizontal size={18} color="#C0272D" />
                  <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#0D1060' }}>
                    Cookie & Tracking Preferences
                  </h3>
                </div>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: '#64748B', lineHeight: 1.5 }}>
                  Manage the categories of cookies you allow. Learn more in our{' '}
                  <Link to="/cookies" target="_blank" style={{ color: '#0D1060', fontWeight: 600, textDecoration: 'underline' }}>
                    Cookie Policy
                  </Link>.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  borderRadius: '4px',
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="Close preferences"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body: Categories list */}
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* 1. Strictly Necessary */}
              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={16} color="#16A34A" />
                    <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0D1060' }}>
                      Strictly Necessary Cookies
                    </span>
                  </div>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: '#16A34A', background: '#DCFCE7', padding: '0.15rem 0.5rem', borderRadius: '3px', letterSpacing: '0.04em' }}>
                    Always Active
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: '#475569', lineHeight: 1.5 }}>
                  Required for core platform functionality, user authentication, journey quote generation, session persistence, and CSRF security tokens. Cannot be disabled.
                </p>
              </div>

              {/* 2. Payment (Paystack) */}
              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Lock size={16} color="#0D1060" />
                    <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0D1060' }}>
                      Secure Payment Processing (Paystack)
                    </span>
                  </div>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: '#0D1060', background: 'rgba(13, 16, 96, 0.08)', padding: '0.15rem 0.5rem', borderRadius: '3px', letterSpacing: '0.04em' }}>
                    Always Active
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: '#475569', lineHeight: 1.5 }}>
                  Set by our certified payment gateway, Paystack, to securely handle checkout card tokenization, fraud checks, and 3D-Secure bank authentication.
                </p>
              </div>

              {/* 3. Functional Cookies */}
              <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0D1060' }}>
                    Functional Cookies
                  </span>
                  <label style={{ position: 'relative', display: 'inline-block', width: '42px', height: '24px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: preferences.functional ? '#C0272D' : '#CBD5E1',
                        borderRadius: '24px',
                        transition: 'background-color 0.2s ease',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          content: '""',
                          height: '18px',
                          width: '18px',
                          left: preferences.functional ? '20px' : '3px',
                          bottom: '3px',
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          transition: 'left 0.2s ease',
                        }}
                      />
                    </span>
                  </label>
                </div>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: '#475569', lineHeight: 1.5 }}>
                  Remembers your recent pickup and destination queries, vehicle selection, and customer form inputs to streamline re-booking without re-entering details.
                </p>
              </div>

              {/* 4. Analytics Cookies */}
              <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0D1060' }}>
                    Analytics & Performance Cookies
                  </span>
                  <label style={{ position: 'relative', display: 'inline-block', width: '42px', height: '24px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: preferences.analytics ? '#C0272D' : '#CBD5E1',
                        borderRadius: '24px',
                        transition: 'background-color 0.2s ease',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          content: '""',
                          height: '18px',
                          width: '18px',
                          left: preferences.analytics ? '20px' : '3px',
                          bottom: '3px',
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          transition: 'left 0.2s ease',
                        }}
                      />
                    </span>
                  </label>
                </div>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: '#475569', lineHeight: 1.5 }}>
                  Helps us understand aggregated user traffic patterns, calculate page loading speeds, and detect routing errors across the booking flow.
                </p>
              </div>

              {/* 5. Marketing Cookies */}
              <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0D1060' }}>
                    Marketing & Promotional Cookies
                  </span>
                  <label style={{ position: 'relative', display: 'inline-block', width: '42px', height: '24px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: preferences.marketing ? '#C0272D' : '#CBD5E1',
                        borderRadius: '24px',
                        transition: 'background-color 0.2s ease',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          content: '""',
                          height: '18px',
                          width: '18px',
                          left: preferences.marketing ? '20px' : '3px',
                          bottom: '3px',
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          transition: 'left 0.2s ease',
                        }}
                      />
                    </span>
                  </label>
                </div>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: '#475569', lineHeight: 1.5 }}>
                  Used to evaluate campaign performance and deliver relevant enterprise transport offers and corporate charter discount alerts.
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
                background: '#F8FAFC',
                borderBottomLeftRadius: '8px',
                borderBottomRightRadius: '8px',
              }}
            >
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                style={{
                  background: 'transparent',
                  border: '1px solid #CBD5E1',
                  color: '#475569',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Back to Banner
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  style={{
                    background: '#0D1060',
                    border: '1px solid #0D1060',
                    color: '#ffffff',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Save Preferences
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  style={{
                    background: '#C0272D',
                    border: '1px solid #C0272D',
                    color: '#ffffff',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Accept All
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── Persistent Bottom Banner ── */}
      {!showPreferences && (
        <aside
          role="region"
          aria-label="Cookie consent banner"
          style={{
            position: 'fixed',
            bottom: '1rem',
            left: '1rem',
            right: '1rem',
            zIndex: 9998,
            maxWidth: '1180px',
            margin: '0 auto',
            animation: 'netsSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              padding: '1.25rem 1.5rem',
              boxShadow: '0 12px 40px rgba(13, 16, 96, 0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            {/* Left Info */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', flex: '1 1 500px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(192, 39, 45, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                <Cookie size={20} color="#C0272D" />
              </div>

              <div>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0D1060', margin: '0 0 0.25rem 0' }}>
                  We value your privacy & seamless booking experience
                </h4>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: '#475569', lineHeight: 1.5 }}>
                  New Era Transport Services uses essential cookies for secure transactions and journey checkout via Paystack, as well as optional functional and analytics cookies to optimize your route planning. See our{' '}
                  <Link
                    to="/cookies"
                    style={{ color: '#0D1060', fontWeight: 600, textDecoration: 'underline' }}
                  >
                    Cookie Policy
                  </Link>{' '}
                  and{' '}
                  <Link
                    to="/privacy"
                    style={{ color: '#0D1060', fontWeight: 600, textDecoration: 'underline' }}
                  >
                    Privacy Policy
                  </Link>.
                </p>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
                flexShrink: 0,
              }}
            >
              <button
                type="button"
                onClick={() => setShowPreferences(true)}
                style={{
                  background: 'transparent',
                  border: '1px solid #CBD5E1',
                  color: '#475569',
                  padding: '0.55rem 0.875rem',
                  borderRadius: '4px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <SlidersHorizontal size={14} />
                <span>Customize</span>
              </button>

              <button
                type="button"
                onClick={handleRejectNonEssential}
                style={{
                  background: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  color: '#1E293B',
                  padding: '0.55rem 0.875rem',
                  borderRadius: '4px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Necessary Only
              </button>

              <button
                type="button"
                onClick={handleAcceptAll}
                style={{
                  background: '#C0272D',
                  border: '1px solid #C0272D',
                  color: '#ffffff',
                  padding: '0.55rem 1.125rem',
                  borderRadius: '4px',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(192, 39, 45, 0.25)',
                  transition: 'all 0.15s ease',
                }}
              >
                Accept All Cookies
              </button>
            </div>
          </div>
        </aside>
      )}
    </>
  )
}
