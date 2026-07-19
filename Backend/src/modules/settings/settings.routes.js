import { Router } from 'express'
import { requireAuth, requireRole } from '../../middleware/authMiddleware.js'
import * as settingsController from './settings.controller.js'

const router = Router()

router.use(requireAuth, requireRole('super_admin'))
router.get('/', settingsController.getSettings)
router.patch('/', settingsController.updateSettings)

export default router
