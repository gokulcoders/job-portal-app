import { makeAutoObservable, runInAction } from 'mobx'
import axiosInstance from '@api/axiosInstance'
import { ENDPOINTS } from '@api/endpoints'

// Get user's real public IP — backend resolves full geo details (avoids browser CORS)
async function fetchPublicIP() {
  try {
    const res    = await fetch('https://api.ipify.org?format=json')
    const { ip } = await res.json()
    return ip
  } catch {
    return null
  }
}

class AuthStore {
  user        = null
  accessToken = localStorage.getItem('accessToken') || null
  loading     = false
  error       = null
  // Stores email temporarily between register → OTP page
  pendingEmail = sessionStorage.getItem('pendingEmail') || null

  constructor() {
    makeAutoObservable(this)
    // Restore user from localStorage so profile data is available on page refresh
    try {
      const stored = localStorage.getItem('authUser')
      if (stored) this.user = JSON.parse(stored)
    } catch { /* ignore */ }
  }

  get isAuthenticated() {
    return !!this.accessToken
  }

  // Decoded from JWT payload — role is always embedded in the token
  get role() {
    if (this.user?.role) return this.user.role
    try {
      if (!this.accessToken) return null
      const b64     = this.accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
      const payload = JSON.parse(atob(b64))
      return payload.role || 'user'
    } catch { return null }
  }

  get userName() {
    return this.user?.name || this.user?.email?.split('@')[0] || 'User'
  }

  // ── REGISTER ──────────────────────────────────────────────────
  async register({ username, email, password }) {
    this.loading = true
    this.error   = null
    try {
      const ipAddress = await fetchPublicIP()

      const { data } = await axiosInstance.post(ENDPOINTS.REGISTER, {
        name: username,
        email,
        password,
        ipAddress,
      })

      runInAction(() => {
        this.pendingEmail = email
        sessionStorage.setItem('pendingEmail', email)
      })

      return data
    } catch (err) {
      runInAction(() => {
        this.error = err.response?.data?.message || 'Registration failed. Please try again.'
      })
      throw err
    } finally {
      runInAction(() => { this.loading = false })
    }
  }

  // ── VERIFY OTP ────────────────────────────────────────────────
  async verifyOTP(otp) {
    this.loading = true
    this.error   = null
    try {
      const email = this.pendingEmail
      if (!email) throw new Error('Session expired. Please register again.')

      const { data } = await axiosInstance.post(ENDPOINTS.VERIFY_OTP, { email, otp })

      // Store tokens → user goes straight to dashboard
      runInAction(() => {
        this.user        = data.user
        this.accessToken = data.accessToken
        localStorage.setItem('accessToken',  data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        localStorage.setItem('authUser',     JSON.stringify(data.user))
        sessionStorage.removeItem('pendingEmail')
        this.pendingEmail = null
      })

      return data
    } catch (err) {
      runInAction(() => {
        this.error = err.response?.data?.message || 'Invalid OTP. Please try again.'
      })
      throw err
    } finally {
      runInAction(() => { this.loading = false })
    }
  }

  // ── RESEND OTP ────────────────────────────────────────────────
  async resendOTP() {
    this.error = null
    try {
      const email = this.pendingEmail
      if (!email) throw new Error('Session expired.')
      await axiosInstance.post(ENDPOINTS.RESEND_OTP, { email })
    } catch (err) {
      runInAction(() => {
        this.error = err.response?.data?.message || 'Failed to resend OTP.'
      })
      throw err
    }
  }

  // ── LOGIN ─────────────────────────────────────────────────────
  async login({ email, password }) {
    this.loading = true
    this.error   = null
    try {
      const { data } = await axiosInstance.post(ENDPOINTS.LOGIN, { email, password })

      runInAction(() => {
        this.user        = data.user
        this.accessToken = data.accessToken
        localStorage.setItem('accessToken',  data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        localStorage.setItem('authUser',     JSON.stringify(data.user))
      })
    } catch (err) {
      runInAction(() => {
        this.error = err.response?.data?.message || 'Invalid email or password.'
      })
      throw err
    } finally {
      runInAction(() => { this.loading = false })
    }
  }

  // ── FORGOT PASSWORD ───────────────────────────────────────────
  async forgotPassword(email) {
    this.error = null
    try {
      await axiosInstance.post(ENDPOINTS.FORGOT_PASSWORD, { email })
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send reset email.'
      runInAction(() => { this.error = msg })
      throw new Error(msg)
    }
  }

  // ── RESET PASSWORD ────────────────────────────────────────────
  async resetPassword({ email, otp, newPassword }) {
    this.error = null
    try {
      await axiosInstance.post(ENDPOINTS.RESET_PASSWORD, { email, otp, newPassword })
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid or expired code.'
      runInAction(() => { this.error = msg })
      throw new Error(msg)
    }
  }

  // ── LOAD PROFILE ──────────────────────────────────────────────
  async loadProfile() {
    try {
      const { data } = await axiosInstance.get(ENDPOINTS.ME)
      runInAction(() => {
        this.user = { ...this.user, ...data.user }
        localStorage.setItem('authUser', JSON.stringify(this.user))
      })
    } catch { /* ignore */ }
  }

  // ── UPDATE PROFILE ────────────────────────────────────────────
  async updateProfile(profileData) {
    this.loading = true
    this.error   = null
    try {
      const { data } = await axiosInstance.patch(ENDPOINTS.UPDATE_PROFILE, profileData)
      runInAction(() => {
        this.user = { ...this.user, ...data.user }
        localStorage.setItem('authUser', JSON.stringify(this.user))
      })
      return data
    } catch (err) {
      const msg = err.response?.data?.message || 'Update failed'
      runInAction(() => { this.error = msg })
      throw new Error(msg)
    } finally {
      runInAction(() => { this.loading = false })
    }
  }

  // ── CHANGE PASSWORD ───────────────────────────────────────────
  async changePassword(currentPassword, newPassword) {
    try {
      await axiosInstance.post(ENDPOINTS.CHANGE_PASSWORD, { currentPassword, newPassword })
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Password change failed')
    }
  }

  // ── LOGOUT ────────────────────────────────────────────────────
  async logout() {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        await axiosInstance.post(ENDPOINTS.LOGOUT, { refreshToken })
      }
    } catch { /* ignore */ } finally {
      runInAction(() => {
        this.user        = null
        this.accessToken = null
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('authUser')
      })
    }
  }
}

export default AuthStore
