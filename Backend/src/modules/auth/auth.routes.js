import { Router } from 'express'
import { requireAuth } from '../../middleware/authMiddleware.js'
import { rateLimit } from '../../middleware/rateLimiter.js'
import * as authController from './auth.controller.js'

const router = Router()

const otpLimiter = rateLimit({ windowSeconds: 15 * 60, max: 5 })
const loginLimiter = rateLimit({ windowSeconds: 15 * 60, max: 10 })

router.post('/register', otpLimiter, authController.register)
router.post('/verify-otp', otpLimiter, authController.verifyOtp)
router.post('/resend-otp', otpLimiter, authController.resendOtp)
router.post('/login', loginLimiter, authController.login)
router.post('/refresh', authController.refresh)
router.post('/logout', authController.logout)
router.post('/forgot-password', otpLimiter, authController.forgotPassword)
router.post('/reset-password', otpLimiter, authController.resetPassword)

router.get('/me', requireAuth, authController.getMe)
router.patch('/me', requireAuth, authController.updateProfile)
router.patch('/plan', requireAuth, authController.updatePlan)
router.post('/change-password', requireAuth, authController.changePassword)

export default router
