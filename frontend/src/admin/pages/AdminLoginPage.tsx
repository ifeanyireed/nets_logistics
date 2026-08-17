// ============================================================================
// NETS Admin — Login Page
// ============================================================================
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminStore } from '../store/useAdminStore'
import { emailService } from '../../services/emailService'
import { KeyRound, Mail, Lock, CheckCircle2, AlertCircle, Eye, EyeOff, ArrowLeft, X } from 'lucide-react'
import '../admin.css'

export function AdminLoginPage() {
  const { login } = useAdminStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotStep, setForgotStep] = useState<1 | 2>(1)
  const [forgotEmail, setForgotEmail] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPass, setShowNewPass] = useState(false)
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotError, setForgotError] = useState('')
  const [forgotSuccess, setForgotSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMessage('')
    await new Promise(r => setTimeout(r, 400))
    const ok = login(email, password)
    if (ok) {
      navigate('/admin', { replace: true })
    } else {
      setError('Invalid email address or password. Please try again.')
      setLoading(false)
    }
  }

  // ── Forgot Password Handlers ──────────────────────────────────────────────
  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanEmail = forgotEmail.trim().toLowerCase()
    if (!cleanEmail) return

    setForgotLoading(true)
    setForgotError('')
    setForgotSuccess('')

    // Generate random 6-digit verification code
    const generatedCode = String(Math.floor(100000 + Math.random() * 900000))
    const tokenData = {
      email: cleanEmail,
      code: generatedCode,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins
    }

    try {
      const tokens = JSON.parse(localStorage.getItem('nets_reset_tokens') || '{}')
      tokens[cleanEmail] = tokenData
      localStorage.setItem('nets_reset_tokens', JSON.stringify(tokens))

      // Dispatch real email via email proxy
      const resetLink = `${window.location.origin}/admin/login?email=${encodeURIComponent(cleanEmail)}`
      await emailService.sendPasswordResetEmail(cleanEmail, generatedCode, resetLink)
    } catch (err) {
      console.warn('Reset token save error:', err)
    }

    setForgotLoading(false)
    setForgotSuccess(`We have sent a 6-digit security code to ${cleanEmail}.`)
    setForgotStep(2)
  }

  const handleVerifyAndResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanEmail = forgotEmail.trim().toLowerCase()
    setForgotError('')

    if (newPassword.length < 6) {
      setForgotError('New password must be at least 6 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setForgotError('New passwords do not match.')
      return
    }

    try {
      const tokens = JSON.parse(localStorage.getItem('nets_reset_tokens') || '{}')
      const tokenObj = tokens[cleanEmail]

      if (!tokenObj || String(tokenObj.code).trim() !== resetCode.trim()) {
        setForgotError('Invalid verification code. Please check your email or request a new code.')
        return
      }

      if (Date.now() > tokenObj.expiresAt) {
        setForgotError('This verification code has expired. Please request a new code.')
        return
      }

      // Save updated password in local storage
      const customPasswords = JSON.parse(localStorage.getItem('nets_user_passwords') || '{}')
      customPasswords[cleanEmail] = newPassword.trim()
      localStorage.setItem('nets_user_passwords', JSON.stringify(customPasswords))

      // Clean up used token
      delete tokens[cleanEmail]
      localStorage.setItem('nets_reset_tokens', JSON.stringify(tokens))

      setShowForgotModal(false)
      setEmail(cleanEmail)
      setPassword(newPassword.trim())
      setSuccessMessage('Password reset successfully! You can now sign in.')
    } catch (err) {
      setForgotError('Failed to reset password. Please try again.')
    }
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

          {successMessage && (
            <div style={{ padding: '0.75rem 1rem', background: 'var(--adm-success-subtle)', border: '1px solid var(--adm-success)', borderRadius: 'var(--adm-radius-sm)', color: 'var(--adm-success)', fontSize: 13, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <CheckCircle2 size={16} />
              <span>{successMessage}</span>
            </div>
          )}

          {error && <div className="admin-login-error">{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="admin-form-group">
              <label className="admin-label admin-label-req">Email Address</label>
              <input className="admin-input" type="email" required autoComplete="email"
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="admin-form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <label className="admin-label admin-label-req" style={{ marginBottom: 0 }}>Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email)
                    setForgotStep(1)
                    setForgotError('')
                    setForgotSuccess('')
                    setShowForgotModal(true)
                  }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--adm-accent)', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  Forgot password?
                </button>
              </div>
              <input className="admin-input" type="password" required autoComplete="current-password"
                placeholder="Enter your password"
                value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button className={`admin-btn admin-btn-primary ${loading ? 'is-loading' : ''}`} type="submit" disabled={loading}
              style={{ marginTop: '0.5rem', height: 40, fontSize: 14, justifyContent: 'center' }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>

      {/* ── Forgot / Reset Password Modal ───────────────────────────────────── */}
      {showForgotModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="admin-card" style={{ width: '100%', maxWidth: 440, position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <button
              onClick={() => setShowForgotModal(false)}
              className="admin-btn admin-btn-icon admin-btn-ghost"
              style={{ position: 'absolute', top: 14, right: 14 }}
            >
              <X size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--adm-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--adm-accent)' }}>
                <KeyRound size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--adm-text-1)' }}>
                  {forgotStep === 1 ? 'Reset Your Password' : 'Enter Verification Code'}
                </h3>
                <span style={{ fontSize: 12, color: 'var(--adm-text-3)' }}>
                  {forgotStep === 1 ? 'Step 1 of 2: Security Verification' : 'Step 2 of 2: New Password'}
                </span>
              </div>
            </div>

            {forgotError && (
              <div style={{ padding: '0.625rem 0.875rem', background: 'var(--adm-danger-subtle)', border: '1px solid var(--adm-danger)', borderRadius: 'var(--adm-radius-sm)', color: 'var(--adm-danger)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1rem' }}>
                <AlertCircle size={14} />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotSuccess && (
              <div style={{ padding: '0.625rem 0.875rem', background: 'var(--adm-success-subtle)', border: '1px solid var(--adm-success)', borderRadius: 'var(--adm-radius-sm)', color: 'var(--adm-success)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1rem' }}>
                <CheckCircle2 size={14} />
                <span>{forgotSuccess}</span>
              </div>
            )}

            {forgotStep === 1 ? (
              <form onSubmit={handleSendResetCode} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: 13, color: 'var(--adm-text-2)', margin: '0 0 0.5rem 0', lineHeight: 1.4 }}>
                  Enter your registered work email address. We'll send you a 6-digit security code via our mail proxy to verify your identity.
                </p>
                <div className="admin-form-group">
                  <label className="admin-label admin-label-req">Work Email Address</label>
                  <input
                    className="admin-input"
                    type="email"
                    required
                    placeholder="e.g. olateju.daniel@neweratransports.com"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setShowForgotModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={forgotLoading || !forgotEmail.trim()} className={`admin-btn admin-btn-primary ${forgotLoading ? 'is-loading' : ''}`}>
                    <Mail size={14} />
                    {forgotLoading ? 'Sending code…' : 'Send Verification Code'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyAndResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="admin-form-group">
                  <label className="admin-label admin-label-req">6-Digit Security Code</label>
                  <input
                    className="admin-input"
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    value={resetCode}
                    onChange={e => setResetCode(e.target.value)}
                    style={{ fontSize: 18, letterSpacing: '0.2em', textAlign: 'center', fontWeight: 700, fontFamily: 'monospace' }}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label admin-label-req">New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="admin-input"
                      type={showNewPass ? 'text' : 'password'}
                      required
                      placeholder="Minimum 6 characters"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      style={{ paddingRight: '2.5rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--adm-text-3)', cursor: 'pointer' }}
                    >
                      {showNewPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label admin-label-req">Confirm New Password</label>
                  <input
                    className="admin-input"
                    type={showNewPass ? 'text' : 'password'}
                    required
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost admin-btn-sm"
                    onClick={() => { setForgotStep(1); setForgotError('') }}
                  >
                    <ArrowLeft size={13} /> Back
                  </button>
                  <button
                    type="submit"
                    className="admin-btn admin-btn-primary"
                    disabled={!resetCode.trim() || !newPassword || !confirmPassword}
                  >
                    Reset & Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
