import { Router } from 'express'
import { requireAuth, requireRole } from '../../middleware/authMiddleware.js'
import * as analyticsController from './analytics.controller.js'

const router = Router()

router.use(requireAuth, requireRole('admin'))
router.get('/overview', analyticsController.getOverview)

export default router
