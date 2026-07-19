import { Router } from 'express'
import { requireAuth, requireRole } from '../../middleware/authMiddleware.js'
import * as coursesController from './courses.controller.js'

const router = Router()

// ── Public ──────────────────────────────────────────────────────────────
router.get('/', coursesController.listPublic)

// ── Own progress (must come before the generic '/:id' routes) ────────────
router.get('/my-progress', requireAuth, coursesController.listMyProgress)

// ── Admin management (super_admin only) ───────────────────────────────────
router.get('/admin/all', requireAuth, requireRole('super_admin'), coursesController.listAllAdmin)
router.post('/admin', requireAuth, requireRole('super_admin'), coursesController.create)
router.patch('/admin/:id', requireAuth, requireRole('super_admin'), coursesController.update)
router.delete('/admin/:id', requireAuth, requireRole('super_admin'), coursesController.remove)

// ── Single course + progress ───────────────────────────────────────────
router.get('/:id', coursesController.getOne)
router.get('/:id/progress', requireAuth, coursesController.getMyProgressForCourse)
router.post('/:id/progress', requireAuth, coursesController.saveProgress)

export default router
