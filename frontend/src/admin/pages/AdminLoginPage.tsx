// ============================================================================
// NETS Admin — Login Page
// ============================================================================
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminStore } from '../store/useAdminStore'
import '../admin.css'

export function AdminLoginPage() {
  const { login } = useAdminStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@netsnigeria.com')
  const [password, setPassword] = useState('nets2026')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    await new Promise(r => setTimeout(r, 400))
    const ok = login(email, password)
    if (ok) { navigate('/admin', { replace: true }) }
    else { setError('Invalid email address or password. Please try again.'); setLoading(false) }
  }

  const handleQuickLogin = (role: 'admin' | 'staff') => {
    const targetEmail = role === 'admin' ? 'admin@netsnigeria.com' : 'staff@netsnigeria.com'
    setEmail(targetEmail)
    setPassword('nets2026')
    setLoading(true)
    setTimeout(() => {
      login(targetEmail, 'nets2026')
      navigate('/admin', { replace: true })
    }, 300)
  }

  return (
    <div className="admin-shell">
      <div className="admin-login-wrap">
        <div className="admin-login-box">
          <div className="admin-login-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <img src="/favicon.svg" alt="NETS Admin Logo" style={{ height: '48px', width: '48px', objectFit: 'contain' }} />
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.1 }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--adm-text-1)', letterSpacing: '-0.02em' }}>NETS</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--adm-accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Control Center</span>
            </div>
          </div>

          <div className="admin-login-title">Sign in to your account</div>
          <div className="admin-login-sub">Access is restricted to authorised NETS personnel only.</div>

          {error && <div className="admin-login-error">{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="admin-form-group">
              <label className="admin-label admin-label-req">Email Address</label>
              <input className="admin-input" type="email" required autoComplete="email"
                placeholder="yourname@netsnigeria.com"
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="admin-form-group">
              <label className="admin-label admin-label-req">Password</label>
              <input className="admin-input" type="password" required autoComplete="current-password"
                placeholder="Enter your password"
                value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button className={`admin-btn admin-btn-primary ${loading ? 'is-loading' : ''}`} type="submit" disabled={loading}
              style={{ marginTop: '0.5rem', height: 40, fontSize: 14, justifyContent: 'center' }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--adm-surface-2)', border: '1px solid var(--adm-border)', borderRadius: 'var(--adm-radius-sm)', fontSize: 12, color: 'var(--adm-text-2)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div>
              <strong style={{ color: 'var(--adm-text-1)' }}>Quick Demo Logins:</strong><br />
              Password for all: <code style={{ color: 'var(--adm-accent)', fontWeight: 600 }}>nets2026</code>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.25rem' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="admin-btn admin-btn-ghost admin-btn-sm"
                style={{ justifyContent: 'center' }}
              >
                ⚡ Sign in (Admin)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('staff')}
                className="admin-btn admin-btn-ghost admin-btn-sm"
                style={{ justifyContent: 'center' }}
              >
                ⚡ Sign in (Staff)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
