import { Router } from 'express'
import { requireAuth } from '../../middleware/authMiddleware.js'
import * as notificationsController from './notifications.controller.js'

const router = Router()

router.use(requireAuth)
router.get('/me', notificationsController.listMine)
router.patch('/read-all', notificationsController.markAllRead)
router.patch('/:id/read', notificationsController.markRead)

export default router
