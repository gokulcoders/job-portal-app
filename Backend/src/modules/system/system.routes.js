import { Router } from 'express'
import { requireAuth, requireRole } from '../../middleware/authMiddleware.js'
import * as systemController from './system.controller.js'

const router = Router()

router.use(requireAuth, requireRole('super_admin'))
router.get('/health', systemController.getHealth)
router.post('/maintenance/flush-cache', systemController.flushCache)
router.post('/maintenance/run-cleanup', systemController.runCleanupJobs)

export default router
