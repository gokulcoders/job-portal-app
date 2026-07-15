import { useState, useRef, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useStores } from '@hooks/useStores'
import loginArt from '@/assets/images/login-art.png'
import '../Login/Login.css'
import './ResetPassword.css'

const LogoIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect width="44" height="44" rx="10" fill="#1a1a2e" />
    <path d="M22 10L30.66 15V25L22 30L13.34 25V15L22 10Z"
      fill="white" fillOpacity="0.15" stroke="white" strokeWidth="1.5" />
    <path d="M18 20L22 17L26 20L22 23L18 20Z" fill="white" />
    <path d="M22 23V28" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

const ResetPassword = observer(() => {
  const { authStore } = useStores()
  const navigate  = useNavigate()
  const location  = useLocation()

  const email = location.state?.email || sessionStorage.getItem('resetEmail') || ''

  const [otp, setOtp]             = useState(['', '', '', '', '', ''])
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [showPass, setShowPass]   = useState(false)
  const [showConf, setShowConf]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState(false)
  const inputRefs = useRef([])

  useEffect(() => {
    if (!email) navigate('/forgot-password', { replace: true })
    else sessionStorage.setItem('resetEmail', email)
  }, [email, navigate])

  const handleOtpChange = (e, i) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 1)
    const next = [...otp]; next[i] = val; setOtp(next)
    if (val && i < 5) inputRefs.current[i + 1]?.focus()
  }

  const handleOtpKey = (e, i) => {
    if (e.key === 'Backspace') {
      if (otp[i] === '' && i > 0) inputRefs.current[i - 1]?.focus()
      else { const n = [...otp]; n[i] = ''; setOtp(n) }
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const next = [...otp]
    pasted.split('').forEach((ch, i) => { next[i] = ch })
    setOtp(next)
    inputRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  const strengthLevel = password.length === 0 ? null
    : password.length < 8 ? 'weak'
    : password.length < 12 ? 'fair'
    : 'strong'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (otp.some(v => !v))     return setError('Please enter the full 6-digit code')
    if (password.length < 8)   return setError('Password must be at least 8 characters')
    if (password !== confirm)  return setError('Passwords do not match')

    setLoading(true)
    setError('')
    try {
      await authStore.resetPassword({ email, otp: otp.join(''), newPassword: password })
      setSuccess(true)
      sessionStorage.removeItem('resetEmail')
      setTimeout(() => navigate('/login', { state: { resetSuccess: true } }), 2000)
    } catch (err) {
      setError(err?.message || 'Invalid or expired code. Please try again.')
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-root">

      {/* ── Left panel (form) ── */}
      <div className="login-left">
        <div className="login-form-wrap">

          <div className="login-logo"><LogoIcon /></div>

          {success ? (
            /* Success state */
            <div className="rp-success-wrap">
              <div className="rp-success-icon">✓</div>
              <h1 className="login-title">Password updated!</h1>
              <p className="login-subtitle">
                Your password has been reset successfully.<br />
                Redirecting you to login...
              </p>
            </div>
          ) : (
            <>
              <h1 className="login-title">Reset password</h1>
              <p className="login-subtitle">
                Enter the code sent to <strong>{email}</strong> and set a new password.
              </p>

              {error && <div className="login-error" role="alert">{error}</div>}

              <form onSubmit={handleSubmit} noValidate>

                {/* OTP boxes */}
                <div className="field-group">
                  <label className="field-label">Verification Code</label>
                  <div className="rp-otp-row">
                    {otp.map((val, i) => (
                      <input
                        key={i}
                        type="text"
                        inputMode="numeric"
                        maxLength="1"
                        value={val}
                        autoFocus={i === 0}
                        onChange={(e) => handleOtpChange(e, i)}
                        onKeyDown={(e) => handleOtpKey(e, i)}
                        onPaste={handlePaste}
                        ref={(el) => (inputRefs.current[i] = el)}
                        className={`rp-otp-input ${val ? 'rp-otp-input--filled' : ''}`}
                      />
                    ))}
                  </div>
                </div>

                {/* New password */}
                <div className="field-group">
                  <label className="field-label">New Password</label>
                  <div className="password-wrap">
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="Min 8 characters"
                      autoComplete="new-password"
                      className="field-input password-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="button" className="eye-btn"
                      onClick={() => setShowPass(v => !v)}
                      aria-label={showPass ? 'Hide' : 'Show'}>
                      {showPass ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {/* Strength bar */}
                  {strengthLevel && (
                    <div className="rp-strength">
                      <div className="rp-strength-bar">
                        <div className={`rp-strength-fill rp-strength-${strengthLevel}`}
                          style={{ width: strengthLevel === 'weak' ? '33%' : strengthLevel === 'fair' ? '66%' : '100%' }}
                        />
                      </div>
                      <span className={`rp-strength-label rp-strength-label-${strengthLevel}`}>
                        {strengthLevel.charAt(0).toUpperCase() + strengthLevel.slice(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="field-group">
                  <label className="field-label">Confirm New Password</label>
                  <div className="password-wrap">
                    <input
                      type={showConf ? 'text' : 'password'}
                      placeholder="Repeat new password"
                      autoComplete="new-password"
                      className={`field-input password-input ${confirm && confirm !== password ? 'field-input--error' : ''}`}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                    />
                    <button type="button" className="eye-btn"
                      onClick={() => setShowConf(v => !v)}
                      aria-label={showConf ? 'Hide' : 'Show'}>
                      {showConf ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {confirm && confirm !== password && (
                    <p className="field-error">Passwords do not match</p>
                  )}
                </div>

                <button type="submit" className="signin-btn" disabled={loading}>
                  {loading ? <span className="signin-btn-spinner" /> : 'Reset Password'}
                </button>

              </form>

              <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                <Link to="/forgot-password" className="forgot-link">← Send a new code</Link>
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

export default ResetPassword
