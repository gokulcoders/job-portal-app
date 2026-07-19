import bcrypt from 'bcryptjs'
import User from '../../models/User.js'
import { ApiError } from '../../utils/ApiError.js'
import { setOtp, consumeOtp } from '../../utils/otp.js'
import { sendOtpEmail } from '../../utils/sendEmail.js'
import { geoLookup } from '../../utils/geoLookup.js'
import { issueTokens, verifyRefreshToken, signAccessToken, signRefreshToken } from '../../utils/tokens.js'
import { getSettings } from '../settings/settings.service.js'

export function sanitizeUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    tenantId: user.tenantId,
    plan: user.plan,
    isVerified: user.isVerified,
    isActive: user.isActive,
    phone: user.phone,
    bio: user.bio,
    city: user.city,
    country: user.country,
    postalCode: user.postalCode,
    geoInfo: user.geoInfo,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
  }
}

export async function register({ name, email, password, ipAddress }) {
  const settings = await getSettings()
  if (!settings.allowRegistrations) throw new ApiError(403, 'New registrations are temporarily closed')

  const existing = await User.findOne({ email })
  if (existing?.isVerified) throw new ApiError(409, 'Email is already registered')

  const hashedPassword = await bcrypt.hash(password, 10)
  const geoInfo = await geoLookup(ipAddress)

  const user =
    existing ||
    new User({
      name,
      email,
      geoInfo,
    })

  user.name = name
  user.password = hashedPassword
  user.geoInfo = geoInfo || user.geoInfo
  await user.save()

  const code = await setOtp(email, 'verify')
  await sendOtpEmail(email, code, 'verify')
}

export async function verifyOtp({ email, otp }) {
  const valid = await consumeOtp(email, 'verify', otp)
  if (!valid) throw new ApiError(400, 'Invalid or expired code')

  const user = await User.findOne({ email })
  if (!user) throw new ApiError(404, 'User not found')

  user.isVerified = true
  user.lastLoginAt = new Date()
  const tokens = await issueTokens(user)

  return { user: sanitizeUser(user), ...tokens }
}

export async function resendOtp({ email }) {
  const user = await User.findOne({ email })
  if (!user) throw new ApiError(404, 'No pending registration for this email')

  const code = await setOtp(email, 'verify')
  await sendOtpEmail(email, code, 'verify')
}

export async function login({ email, password }) {
  const user = await User.findOne({ email }).select('+password')
  if (!user) throw new ApiError(401, 'Invalid email or password')
  if (!user.isVerified) throw new ApiError(403, 'Please verify your email before logging in')
  if (!user.isActive) throw new ApiError(403, 'This account has been suspended')

  const matches = await bcrypt.compare(password, user.password)
  if (!matches) throw new ApiError(401, 'Invalid email or password')

  if (user.role === 'user') {
    const settings = await getSettings()
    if (settings.maintenanceMode) throw new ApiError(503, 'The site is currently down for maintenance. Please check back soon.')
  }

  user.lastLoginAt = new Date()
  const tokens = await issueTokens(user)

  return { user: sanitizeUser(user), ...tokens }
}

export async function refresh({ refreshToken }) {
  if (!refreshToken) throw new ApiError(401, 'Missing refresh token')

  let payload
  try {
    payload = verifyRefreshToken(refreshToken)
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token')
  }

  const user = await User.findById(payload.id).select('+refreshToken')
  if (!user || user.refreshToken !== refreshToken) {
    throw new ApiError(401, 'Invalid or expired refresh token')
  }

  const accessToken = signAccessToken(user)
  const newRefreshToken = signRefreshToken(user)
  user.refreshToken = newRefreshToken
  await user.save()

  return { accessToken, refreshToken: newRefreshToken }
}

export async function logout({ refreshToken }) {
  if (!refreshToken) return
  await User.findOneAndUpdate({ refreshToken }, { refreshToken: null })
}

export async function forgotPassword({ email }) {
  const user = await User.findOne({ email })
  if (user) {
    const code = await setOtp(email, 'reset')
    await sendOtpEmail(email, code, 'reset')
  }
  // Always respond the same way regardless of whether the email exists,
  // so this endpoint can't be used to enumerate registered accounts.
}

export async function resetPassword({ email, otp, newPassword }) {
  const valid = await consumeOtp(email, 'reset', otp)
  if (!valid) throw new ApiError(400, 'Invalid or expired code')

  const user = await User.findOne({ email })
  if (!user) throw new ApiError(404, 'User not found')

  user.password = await bcrypt.hash(newPassword, 10)
  await user.save()
}

export async function getMe({ id }) {
  const user = await User.findById(id)
  if (!user) throw new ApiError(404, 'User not found')
  return sanitizeUser(user)
}

export async function updateProfile({ id }, updates) {
  const allowed = ['name', 'phone', 'bio', 'city', 'country', 'postalCode']
  const patch = {}
  for (const key of allowed) {
    if (updates[key] !== undefined) patch[key] = updates[key]
  }

  const user = await User.findByIdAndUpdate(id, patch, { new: true, runValidators: true })
  if (!user) throw new ApiError(404, 'User not found')
  return sanitizeUser(user)
}

export async function updatePlan({ id }, plan) {
  if (!['free', 'pro', 'teams'].includes(plan)) throw new ApiError(400, 'Invalid plan')
  const user = await User.findByIdAndUpdate(id, { plan }, { new: true })
  if (!user) throw new ApiError(404, 'User not found')
  return sanitizeUser(user)
}

export async function changePassword({ id }, { currentPassword, newPassword }) {
  const user = await User.findById(id).select('+password')
  if (!user) throw new ApiError(404, 'User not found')

  const matches = await bcrypt.compare(currentPassword, user.password)
  if (!matches) throw new ApiError(401, 'Current password is incorrect')

  user.password = await bcrypt.hash(newPassword, 10)
  await user.save()
}
