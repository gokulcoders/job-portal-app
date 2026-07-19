import { Router } from 'express'
import { requireAuth, requireRole } from '../../middleware/authMiddleware.js'
import * as billingController from './billing.controller.js'

const router = Router()

router.use(requireAuth, requireRole('super_admin'))
router.get('/stats', billingController.getStats)

export default router
