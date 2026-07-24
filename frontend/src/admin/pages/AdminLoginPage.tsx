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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    await new Promise(r => setTimeout(r, 600))
    const ok = login(email, password)
    if (ok) { navigate('/admin', { replace: true }) }
    else { setError('Invalid email address or password. Please try again.'); setLoading(false) }
  }

  return (
    <div className="admin-shell">
      <div className="admin-login-wrap">
        <div className="admin-login-box">
          <div className="admin-login-logo" style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <img src="/logo-white-final.png" alt="NETS Admin" style={{ height: '48px', width: 'auto', objectFit: 'contain' }} />
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
            <button className="admin-btn admin-btn-primary" type="submit" disabled={loading}
              style={{ marginTop: '0.5rem', height: 40, fontSize: 14 }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '1.75rem', padding: '1rem', background: 'var(--adm-surface-2)', borderRadius: 'var(--adm-radius-sm)', fontSize: 12, color: 'var(--adm-text-3)' }}>
            <strong style={{ color: 'var(--adm-text-2)' }}>Demo credentials</strong><br />
            Email: <code style={{ color: 'var(--adm-accent)' }}>admin@netsnigeria.com</code><br />
            Password: <code style={{ color: 'var(--adm-accent)' }}>nets2026</code>
          </div>
        </div>
      </div>
    </div>
  )
}
