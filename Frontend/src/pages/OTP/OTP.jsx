import { useState, useRef, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Link, useNavigate } from 'react-router-dom'
import { useStores } from '@hooks/useStores'
import { toast } from 'sonner'
import signupArt from '@/assets/images/signup-art.png'
import './OTP.css'

const RESEND_COOLDOWN = 60

const LogoIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect width="44" height="44" rx="10" fill="#1a1a2e" />
    <path d="M22 10L30.66 15V25L22 30L13.34 25V15L22 10Z" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="1.5" />
    <path d="M18 20L22 17L26 20L22 23L18 20Z" fill="white" />
    <path d="M22 23V28" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const OTP = observer(() => {
  const { authStore } = useStores()
  const navigate = useNavigate()
  const [otp, setOtp]               = useState(['', '', '', '', '', ''])
  const [isSubmitting, setSubmitting] = useState(false)
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN)
  const [resending, setResending]     = useState(false)
  const [successMsg, setSuccessMsg]   = useState('')
  const inputRefs = useRef([])


  // Redirect if no pending email (direct URL access)
  useEffect(() => {
    if (!authStore.pendingEmail) navigate('/register', { replace: true })
  }, [authStore.pendingEmail, navigate])

  // Resend countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return
    const id = setInterval(() => setResendTimer(t => t - 1), 1000)
    return () => clearInterval(id)
  }, [resendTimer])

  const handleChange = (e, index) => {
    const { value } = e.target
    if (/^[0-9]$/.test(value)) {
      const next = [...otp]
      next[index] = value
      setOtp(next)
      if (index < 5) inputRefs.current[index + 1]?.focus()
    } else if (value === '') {
      const next = [...otp]; next[index] = ''; setOtp(next)
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        inputRefs.current[index - 1]?.focus()
      } else {
        const next = [...otp]; next[index] = ''; setOtp(next)
      }
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, 6)
    if (pasted.length) {
      const next = [...otp]
      pasted.split('').forEach((ch, i) => { next[i] = ch })
      setOtp(next)
      const focusIdx = Math.min(pasted.length, 5)
      inputRefs.current[focusIdx]?.focus()
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    authStore.error = null
    try {
      await authStore.verifyOTP(otp.join(''))
      toast.success('Email verified! Welcome to HireVerse')
      navigate('/dashboard', { replace: true })
    } catch {
      toast.error(authStore.error || 'Invalid OTP. Please try again.')
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setSubmitting(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    authStore.error = null
    try {
      await authStore.resendOTP()
      setResendTimer(RESEND_COOLDOWN)
      toast.success('New OTP sent to your email!')
    } catch {
      // error via authStore.error
    } finally {
      setResending(false)
    }
  }

  const isComplete = otp.every(v => v !== '')

  return (
    <div className="otp-root">
      {/* Left panel */}
      <div className="otp-left">
        <div className="otp-art-card">
          <div className="otp-art-image-container">
            <img src={signupArt} alt="Verification" className="otp-art-img" />
          </div>
          <div className="otp-art-content">
            <h2>Verify Your Email</h2>
            <p>We've sent a 6-digit verification code to your email. Enter it below to activate your account.</p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="otp-right">
        <div className="otp-form-wrap">
          <div className="otp-logo"><LogoIcon /></div>
          <h1 className="otp-title">Check Your Email</h1>
          <p className="otp-subtitle">
            Code sent to <strong>{authStore.pendingEmail}</strong>
          </p>

          {authStore.error && (
            <div className="login-error" role="alert">{authStore.error}</div>
          )}
          {successMsg && (
            <div className="otp-success" role="status">{successMsg}</div>
          )}

          <form onSubmit={onSubmit} noValidate>
            <div className="otp-inputs-container">
              {otp.map((value, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={value}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className={`otp-digit-input ${value ? 'otp-digit-input--filled' : ''}`}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <button
              id="verify-btn" type="submit"
              disabled={isSubmitting || !isComplete}
              className="otp-btn"
            >
              {isSubmitting ? <span className="otp-btn-spinner" /> : 'Verify & Continue'}
            </button>
          </form>

          <p className="resend-row">
            Didn't receive the code?{' '}
            {resendTimer > 0 ? (
              <span className="resend-timer">Resend in {resendTimer}s</span>
            ) : (
              <button
                type="button" className="resend-link"
                onClick={handleResend} disabled={resending}
              >
                {resending ? 'Sending...' : 'Resend OTP'}
              </button>
            )}
          </p>

          <p className="signin-row" style={{ marginTop: '0.5rem' }}>
            <Link to="/login" className="signin-link">← Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  )
})

export default OTP
