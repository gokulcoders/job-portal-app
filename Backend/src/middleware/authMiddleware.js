import { ApiError } from '../utils/ApiError.js'
import { verifyAccessToken } from '../utils/tokens.js'

export function requireAuth(req, res, next) {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) throw new ApiError(401, 'Not authenticated')

  try {
    req.user = verifyAccessToken(token)
    next()
  } catch {
    throw new ApiError(401, 'Session expired, please log in again')
  }
}

export function requireRole(minRole) {
  const rank = { user: 0, admin: 1, super_admin: 2 }
  return (req, res, next) => {
    if ((rank[req.user?.role] ?? 0) < (rank[minRole] ?? 0)) {
      throw new ApiError(403, 'Insufficient permissions')
    }
    next()
  }
}
