import { Router } from 'express'
import { requireAuth, requireRole } from '../../middleware/authMiddleware.js'
import * as adminController from './admin.controller.js'

const router = Router()

router.use(requireAuth)

router.get('/users',            requireRole('admin'),       adminController.listUsers)
router.get('/users/stats',      requireRole('admin'),       adminController.getUserStats)
router.get('/users/:id',        requireRole('admin'),       adminController.getUserById)
router.patch('/users/:id/role', requireRole('super_admin'), adminController.updateUserRole)
router.patch('/users/:id/status', requireRole('admin'),     adminController.updateUserStatus)
router.patch('/users/:id/tenant', requireRole('super_admin'), adminController.updateUserTenant)
router.patch('/users/:id/plan', requireRole('super_admin'), adminController.updateUserPlan)
router.post('/users/:id/notify', requireRole('admin'),      adminController.sendUserNotification)
router.delete('/users/:id',     requireRole('super_admin'), adminController.deleteUser)

export default router
