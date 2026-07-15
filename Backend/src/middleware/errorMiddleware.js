import { ApiError } from '../utils/ApiError.js'

export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` })
}

export function errorHandler(err, req, res, next) {
  const statusCode = err instanceof ApiError ? err.statusCode : err.name === 'ValidationError' ? 400 : 500

  if (err.code === 11000) {
    return res.status(409).json({ message: 'Email is already registered' })
  }

  if (statusCode === 500) console.error(err)

  res.status(statusCode).json({ message: err.message || 'Something went wrong' })
}
