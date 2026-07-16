import { Router } from 'express'
import * as jobsController from './jobs.controller.js'
import { requireAuth, requireRole } from '../../middleware/authMiddleware.js'

const router = Router()

router.get('/', jobsController.listJobs)
router.get('/latest', jobsController.latestJobs)
router.get('/search', jobsController.searchJobs)
router.get('/:id', jobsController.getJobById)
router.delete('/:id', requireAuth, requireRole('admin'), jobsController.deleteJob)

export default router
