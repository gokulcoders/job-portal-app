import { asyncHandler } from '../../utils/asyncHandler.js'
import * as authService from './auth.service.js'

export const register = asyncHandler(async (req, res) => {
  await authService.register(req.body)
  res.status(201).json({ message: 'A verification code has been sent to your email.' })
})

export const verifyOtp = asyncHandler(async (req, res) => {
  const result = await authService.verifyOtp(req.body)
  res.json(result)
})

export const resendOtp = asyncHandler(async (req, res) => {
  await authService.resendOtp(req.body)
  res.json({ message: 'A new verification code has been sent to your email.' })
})

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body)
  res.json(result)
})

export const refresh = asyncHandler(async (req, res) => {
  const result = await authService.refresh(req.body)
  res.json(result)
})

export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.body)
  res.json({ message: 'Logged out' })
})

export const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body)
  res.json({ message: 'If that email is registered, a reset code has been sent.' })
})

export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body)
  res.json({ message: 'Password reset successfully' })
})

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user)
  res.json({ user })
})

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user, req.body)
  res.json({ user })
})

export const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user, req.body)
  res.json({ message: 'Password changed successfully' })
})
