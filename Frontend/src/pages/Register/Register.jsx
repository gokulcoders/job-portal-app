import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useStores } from '@hooks/useStores'
import jobRoleLogo from '@/assets/images/jobrole_logo.png'
import './Register.css'

const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

const LogoIcon = () => (
  <img src={jobRoleLogo} alt="JobRole Logo" style={{ height: '60px', mixBlendMode: 'multiply', objectFit: 'contain' }} />
)

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

const Register = observer(() => {
  const { authStore } = useStores()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = async (data) => {
    try {
      await authStore.register(data)
      navigate('/otp')
    } catch {
      // error shown via authStore.error
    }
  }

  return (
    <div className="register-root">
      {/* Left panel */}
      <div className="register-left">
        <div className="register-art-card">
          <div className="register-art-image-container">
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop" alt="Team collaboration" className="register-art-img" />
          </div>
          <div className="register-art-content">
            <h2>Find the Best Talent</h2>
            <p>Discover top-tier candidates, manage your hiring pipeline, and accelerate your recruitment process with ease.</p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="register-right">
        <div className="register-form-wrap">
          <div className="register-logo"><LogoIcon /></div>
          <h1 className="register-title">Create Account</h1>
          <p className="register-subtitle">Join the ultimate job portal platform today.</p>

          {authStore.error && (
            <div className="login-error" role="alert">{authStore.error}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="field-group">
              <label htmlFor="username" className="field-label">Full Name</label>
              <input
                id="username" type="text" placeholder="John Doe"
                className={`field-input ${errors.username ? 'field-input--error' : ''}`}
                {...register('username')}
              />
              {errors.username && <p className="field-error">{errors.username.message}</p>}
            </div>

            <div className="field-group">
              <label htmlFor="email" className="field-label">Email</label>
              <input
                id="email" type="email" placeholder="you@company.com" autoComplete="email"
                className={`field-input ${errors.email ? 'field-input--error' : ''}`}
                {...register('email')}
              />
              {errors.email && <p className="field-error">{errors.email.message}</p>}
            </div>

            <div className="field-group">
              <label htmlFor="password" className="field-label">Password</label>
              <div className="password-wrap">
                <input
                  id="password" type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 characters" autoComplete="new-password"
                  className={`field-input password-input ${errors.password ? 'field-input--error' : ''}`}
                  {...register('password')}
                />
                <button type="button" className="eye-btn" onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.password && <p className="field-error">{errors.password.message}</p>}
            </div>

            <div className="field-group">
              <label htmlFor="confirmPassword" className="field-label">Confirm Password</label>
              <div className="password-wrap">
                <input
                  id="confirmPassword" type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat password" autoComplete="new-password"
                  className={`field-input password-input ${errors.confirmPassword ? 'field-input--error' : ''}`}
                  {...register('confirmPassword')}
                />
                <button type="button" className="eye-btn" onClick={() => setShowConfirm(v => !v)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}>
                  {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.confirmPassword && <p className="field-error">{errors.confirmPassword.message}</p>}
            </div>

            <button
              id="sign-up-btn" type="submit"
              disabled={isSubmitting || authStore.loading}
              className="signup-btn"
            >
              {isSubmitting || authStore.loading
                ? <span className="signup-btn-spinner" />
                : 'Create Account'}
            </button>
          </form>

          <p className="signin-row">
            Already have an account?{' '}
            <Link to="/login" className="signin-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
})

export default Register
