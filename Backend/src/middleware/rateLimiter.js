import { redis } from '../config/redis.js'
import { ApiError } from '../utils/ApiError.js'

// Fixed-window limiter keyed by client IP + route. Kept deliberately simple —
// good enough to blunt brute-force/OTP-spam against auth endpoints.
export function rateLimit({ windowSeconds, max }) {
  return async (req, res, next) => {
    try {
      const key = `ratelimit:${req.baseUrl}${req.path}:${req.ip}`
      const count = await redis.incr(key)
      if (count === 1) await redis.expire(key, windowSeconds)

      if (count > max) {
        throw new ApiError(429, 'Too many requests. Please try again later.')
      }
      next()
    } catch (err) {
      next(err)
    }
  }
}
