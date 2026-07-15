import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Link, useNavigate } from 'react-router-dom'
import { useStores } from '@hooks/useStores'
import loginArt from '@/assets/images/login-art.png'
import '../Login/Login.css'
import './ForgotPassword.css'

const LogoIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="10" fill="#1a1a2e" />
    <path d="M22 10L30.66 15V25L22 30L13.34 25V15L22 10Z"
      fill="white" fillOpacity="0.15" stroke="white" strokeWidth="1.5" />
    <path d="M18 20L22 17L26 20L22 23L18 20Z" fill="white" />
    <path d="M22 23V28" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const MailSentIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none"
    stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const ForgotPassword = observer(() => {
  const { authStore } = useStores()
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMsg, setResendMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address')
      return
    }
    setLoading(true)
    setError('')
    try {
      await authStore.forgotPassword(email)
      setSubmitted(true)
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResendLoading(true)
    setResendMsg('')
    try {
      await authStore.forgotPassword(email)
      setResendMsg('Code resent! Check your inbox.')
      setTimeout(() => setResendMsg(''), 4000)
    } catch {
      setResendMsg('Failed to resend. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="login-root">

      {/* ── Left panel (form) ── */}
      <div className="login-left">
        <div className="login-form-wrap">

          {/* Logo */}
          <div className="login-logo">
            <LogoIcon />
          </div>

          {/* ── SENT STATE ── */}
          {submitted ? (
            <>
              <div className="fp-sent-icon">
                <MailSentIcon />
              </div>
              <h1 className="login-title">Check your email</h1>
              <p className="login-subtitle">
                We sent a 6-digit reset code to <strong>{email}</strong>.
                Open the email and enter the code on the next page.
              </p>

              {resendMsg && (
                <div className={resendMsg.includes('Failed') ? 'login-error' : 'login-success'}>
                  {resendMsg}
                </div>
              )}

              <button
                className="signin-btn"
                style={{ marginBottom: '1rem' }}
                onClick={() => navigate('/reset-password', { state: { email } })}
              >
                Enter Reset Code →
              </button>

              <p className="signup-row">
                Didn't receive it?{' '}
                <button
                  type="button"
                  className="fp-resend-btn"
                  onClick={handleResend}
                  disabled={resendLoading}
                >
                  {resendLoading ? 'Sending...' : 'Resend email'}
                </button>
              </p>

              <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
                <Link to="/login" className="forgot-link">← Back to login</Link>
              </div>
            </>
          ) : (
            /* ── FORM STATE ── */
            <>
              <h1 className="login-title">Forgot password?</h1>
              <p className="login-subtitle">
                No worries! Enter your email and we'll send you a reset code.
              </p>

              {error && (
                <div className="login-error" role="alert">{error}</div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="field-group">
                  <label htmlFor="fp-email" className="field-label">Email address</label>
                  <input
                    id="fp-email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    placeholder="you@company.com"
                    className={`field-input ${error ? 'field-input--error' : ''}`}
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError('') }}
                  />
                </div>

                <button
                  type="submit"
                  className="signin-btn"
                  disabled={loading}
                >
                  {loading
                    ? <span className="signin-btn-spinner" />
                    : 'Send Reset Code'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <Link to="/login" className="forgot-link">← Back to login</Link>
              </div>
            </>
          )}

        </div>
      </div>

      {/* ── Right panel (art) ── */}
      <div className="login-right">
        <div className="login-art-card">
          <img src={loginArt} alt="Abstract blue waves" className="login-art-img" />
        </div>
      </div>

    </div>
  )
})

export default ForgotPassword
