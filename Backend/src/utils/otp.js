import { redis } from '../config/redis.js'

const OTP_TTL_SECONDS = 10 * 60 // 10 minutes

function otpKey(email, purpose) {
  return `otp:${purpose}:${email.toLowerCase()}`
}

export async function setOtp(email, purpose) {
  const code = String(Math.floor(100000 + Math.random() * 900000))
  await redis.set(otpKey(email, purpose), code, 'EX', OTP_TTL_SECONDS)
  return code
}

// Single-use: a valid code is deleted from Redis as soon as it's checked,
// so it can't be replayed even within its TTL window.
export async function consumeOtp(email, purpose, code) {
  const key = otpKey(email, purpose)
  const stored = await redis.get(key)
  if (!stored || stored !== code) return false

  await redis.del(key)
  return true
}
