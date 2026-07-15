import { useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useStores } from '@hooks/useStores'
import { toast } from 'sonner'
import loginArt from '@/assets/images/login-art.png'
import './Login.css'

// ── Validation schema ────────────────────────────────────────────────
const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

// ── SVG icons (inline, no extra dep) ─────────────────────────────────
const LogoIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="10" fill="#1a1a2e" />
    <path
      d="M22 10L30.66 15V25L22 30L13.34 25V15L22 10Z"
      fill="white"
      fillOpacity="0.15"
      stroke="white"
      strokeWidth="1.5"
    />
    <path d="M18 20L22 17L26 20L22 23L18 20Z" fill="white" />
    <path d="M22 23V28" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335" />
  </svg>
)

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
)

// ── Component ─────────────────────────────────────────────────────────
const Login = observer(() => {
  const { authStore } = useStores()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [successMsg, setSuccessMsg]     = useState(
    location.state?.resetSuccess ? 'Password reset successfully! Please sign in.' : ''
  )

  useEffect(() => {
    if (successMsg) {
      const t = setTimeout(() => setSuccessMsg(''), 5000)
      return () => clearTimeout(t)
    }
  }, [successMsg])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data) => {
    try {
      await authStore.login(data)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch {
      toast.error(authStore.error || 'Invalid email or password.')
    }
  }

  return (
    <div className="login-root">
      {/* ── Left panel ── */}
      <div className="login-left">
        <div className="login-form-wrap">
          {/* Logo */}
          <div className="login-logo">
            <LogoIcon />
          </div>

          {/* Heading */}
          <h1 className="login-title">Welcome back!</h1>
          <p className="login-subtitle">Please enter your credentials to sign in!</p>

          {/* Success message (after password reset) */}
          {successMsg && (
            <div className="login-success" role="status">{successMsg}</div>
          )}

          {/* Global error */}
          {authStore.error && (
            <div className="login-error" role="alert">
              {authStore.error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email */}
            <div className="field-group">
              <label htmlFor="email" className="field-label">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`field-input ${errors.email ? 'field-input--error' : ''}`}
                {...register('email')}
              />
              {errors.email && (
                <p className="field-error">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="field-group">
              <label htmlFor="password" className="field-label">Password</label>
              <div className="password-wrap">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`field-input password-input ${errors.password ? 'field-input--error' : ''}`}
                  {...register('password')}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.password && (
                <p className="field-error">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot password */}
            <div className="forgot-row">
              <Link to="/forgot-password" className="forgot-link">Forgot password</Link>
            </div>

            {/* Submit */}
            <button
              id="sign-in-btn"
              type="submit"
              disabled={isSubmitting || authStore.loading}
              className="signin-btn"
            >
              {isSubmitting || authStore.loading ? (
                <span className="signin-btn-spinner" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span className="divider-line" />
            <span className="divider-text">or continue with</span>
            <span className="divider-line" />
          </div>

          {/* Social buttons */}
          <div className="social-row">
            <button id="google-btn" type="button" className="social-btn">
              <GoogleIcon />
              <span>Google</span>
            </button>
            <button id="github-btn" type="button" className="social-btn">
              <GithubIcon />
              <span>Github</span>
            </button>
          </div>

          {/* Sign up link */}
          <p className="signup-row">
            Don't have an account yet?{' '}
            <Link to="/register" className="signup-link">Sign up</Link>
          </p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="login-right">
        <div className="login-art-card">
          <img src={loginArt} alt="Abstract blue waves" className="login-art-img" />
        </div>
      </div>
    </div>
  )
})

export default Login
